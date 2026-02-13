"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createPlaylistItem } from "@/actions/playlist";

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddSongModal({ isOpen, onClose, onSuccess }: AddSongModalProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
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
    setTitle("");
    setArtist("");
    setUrl("");
    setComment("");
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

      const trimmedTitle = title.trim();
      const trimmedUrl = url.trim();
      const trimmedArtist = artist.trim();
      const trimmedComment = comment.trim();

      if (!trimmedTitle || trimmedTitle.length > 200) {
        setError("Название должно содержать от 1 до 200 символов");
        return;
      }
      if (!trimmedUrl || trimmedUrl.length > 500) {
        setError("Ссылка должна содержать от 1 до 500 символов");
        return;
      }
      if (trimmedArtist.length > 200) {
        setError("Имя исполнителя не должно превышать 200 символов");
        return;
      }
      if (trimmedComment.length > 1000) {
        setError("Комментарий не должен превышать 1000 символов");
        return;
      }

      setLoading(true);

      try {
        const result = await createPlaylistItem({
          title: trimmedTitle,
          artist: trimmedArtist || undefined,
          url: trimmedUrl,
          comment: trimmedComment || undefined,
        });

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
    [title, artist, url, comment, reset, onSuccess, onClose],
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
          Добавить песню
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Название"
            placeholder="Название песни"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            autoFocus
          />

          <Input
            label="Исполнитель"
            placeholder="Имя исполнителя"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            maxLength={200}
          />

          <Input
            label="Ссылка"
            placeholder="Ссылка на Spotify, YouTube..."
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            maxLength={500}
          />

          <div>
            <label className="text-ui-sm text-text-muted-dark mb-1 block">
              Комментарий
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Почему эта песня важна для вас?"
              rows={3}
              maxLength={1000}
              className="w-full resize-none bg-surface-secondary border border-border-light rounded-[var(--radius-md)] px-4 py-3 text-hand-md italic text-text-dark placeholder:text-text-muted-dark/50 placeholder:not-italic focus:border-accent-gold focus:outline-none transition-colors duration-200"
            />
          </div>

          {error && (
            <p className="font-ui text-sm text-accent-rose">{error}</p>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Добавить в плейлист
          </Button>
        </form>
      </div>
    </div>
  );
}
