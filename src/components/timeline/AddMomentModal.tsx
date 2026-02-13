"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPresignedUploadUrl, createPhoto } from "@/actions/timeline";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function todayString(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

interface AddMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMomentModal({
  isOpen,
  onClose,
  onSuccess,
}: AddMomentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState(todayString);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Clean up preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setEventDate(todayString());
    setDescription("");
    setError(null);
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (!selected) return;

      if (!selected.type.startsWith("image/")) {
        setError("Допускаются только изображения");
        return;
      }

      if (selected.size > MAX_FILE_SIZE) {
        setError("Файл слишком большой (максимум 10 МБ)");
        return;
      }

      setError(null);
      setFile(selected);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(selected));
    },
    [preview],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!file) {
        setError("Выберите фотографию");
        return;
      }

      if (!eventDate) {
        setError("Укажите дату события");
        return;
      }

      setLoading(true);

      try {
        // 1. Get presigned URL
        const presignedResult = await getPresignedUploadUrl(
          file.name,
          file.type,
        );
        if ("error" in presignedResult) {
          setError(presignedResult.error);
          setLoading(false);
          return;
        }

        const { uploadUrl, fileUrl, key } = presignedResult.data;

        // 2. Upload file to R2
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok) {
          setError("Ошибка загрузки файла. Попробуйте ещё раз.");
          setLoading(false);
          return;
        }

        // 3. Create photo record
        const createResult = await createPhoto({
          url: fileUrl,
          description: description.trim() || undefined,
          eventDate,
        });

        if ("error" in createResult) {
          setError(createResult.error);
          setLoading(false);
          return;
        }

        // 4. Fire-and-forget thumbnail generation
        fetch("/api/thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoId: createResult.data.id, key }),
        }).catch(() => {
          // Thumbnail generation is best-effort
        });

        // 5. Success
        reset();
        onSuccess();
        onClose();
      } catch {
        setError("Произошла ошибка. Попробуйте ещё раз.");
        setLoading(false);
      }
    },
    [file, eventDate, description, reset, onSuccess, onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/85 backdrop-blur-[8px]"
      onClick={handleClose}
    >
      <div
        className="modal-enter relative w-full max-w-[560px] mx-4 bg-surface-primary rounded-[var(--radius-xl)] shadow-[var(--shadow-lifted)] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-text-muted-dark hover:text-text-dark transition-colors"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        <h2 className="text-display-md text-text-dark mb-6">
          Добавить момент
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo drop zone */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview ? (
              <div
                className="relative cursor-pointer overflow-hidden rounded-[var(--radius-md)] border border-border-light"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Предпросмотр"
                  className="w-full h-auto max-h-[280px] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <p className="font-ui text-sm text-white">
                    Нажмите, чтобы заменить
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-border-light rounded-[var(--radius-md)] bg-surface-secondary hover:border-accent-gold transition-colors cursor-pointer"
              >
                <ImagePlus size={36} className="text-text-muted-dark" />
                <p className="font-ui text-sm text-text-muted-dark">
                  Нажмите, чтобы выбрать фото
                </p>
                <p className="font-ui text-xs text-text-muted-dark/60">
                  JPG, PNG, WebP — до 10 МБ
                </p>
              </button>
            )}
          </div>

          {/* Date input */}
          <div>
            <label
              htmlFor="event-date"
              className="font-ui text-[13px] text-text-muted-dark mb-1.5 block"
            >
              Дата события
            </label>
            <input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-surface-secondary border border-border-light rounded-[var(--radius-md)] px-4 py-3 text-text-dark font-body text-base focus:border-accent-gold focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Description textarea */}
          <div>
            <label
              htmlFor="description"
              className="font-ui text-[13px] text-text-muted-dark mb-1.5 block"
            >
              Описание{" "}
              <span className="text-text-muted-dark/50">(необязательно)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Что произошло в этот момент..."
              maxLength={500}
              rows={3}
              className="w-full resize-none bg-surface-secondary border border-border-light rounded-[var(--radius-md)] px-4 py-3 text-text-dark placeholder:text-text-muted-dark/50 placeholder:italic font-body text-base focus:border-accent-gold focus:outline-none transition-colors duration-200"
            />
            <p className="mt-1 text-right font-ui text-xs text-text-muted-dark/50">
              {description.length}/500
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p className="font-ui text-sm text-accent-rose">{error}</p>
          )}

          {/* Submit button */}
          <Button type="submit" fullWidth loading={loading}>
            Добавить момент
          </Button>
        </form>
      </div>
    </div>
  );
}
