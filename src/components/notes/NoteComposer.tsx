"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createNote } from "@/actions/notes";

interface NoteComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partnerName: string;
}

export function NoteComposer({
  isOpen,
  onClose,
  onSuccess,
  partnerName,
}: NoteComposerProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const reset = useCallback(() => {
    setContent("");
    setError(null);
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    reset();
    onClose();
  }, [loading, reset, onClose]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmed = content.trim();
      if (!trimmed) {
        setError("Напишите что-нибудь");
        return;
      }

      if (trimmed.length > 5000) {
        setError("Записка слишком длинная (максимум 5000 символов)");
        return;
      }

      setLoading(true);

      try {
        const result = await createNote(trimmed);
        if ("error" in result) {
          setError(result.error);
          setLoading(false);
          return;
        }

        reset();
        onSuccess();
        onClose();
      } catch {
        setError("Произошла ошибка. Попробуйте ещё раз.");
        setLoading(false);
      }
    },
    [content, reset, onSuccess, onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/85 backdrop-blur-[8px]"
      onClick={handleClose}
    >
      <div
        className="modal-enter relative w-full max-w-[560px] mx-4 max-h-[90vh] overflow-y-auto bg-surface-primary rounded-[var(--radius-xl)] shadow-[var(--shadow-lifted)] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-text-muted-dark hover:text-text-dark transition-colors"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        <h2 className="text-display-md text-text-dark mb-6">
          Новая записка для {partnerName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Напиши что-нибудь тёплое..."
              maxLength={5000}
              rows={8}
              autoFocus
              className="w-full min-h-[160px] sm:min-h-[240px] resize-none bg-surface-primary notebook-lines border border-border-light rounded-[var(--radius-md)] px-5 py-4 text-text-dark placeholder:text-text-muted-dark/50 placeholder:italic font-body text-[18px] leading-[32px] focus:border-accent-gold focus:outline-none transition-colors duration-200"
            />
            <p className="mt-1 text-right font-ui text-xs text-text-muted-dark/50">
              {content.length}/5000
            </p>
          </div>

          {error && (
            <p className="font-ui text-sm text-accent-rose">{error}</p>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Отправить записку
          </Button>
        </form>
      </div>
    </div>
  );
}
