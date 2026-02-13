"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDateRu(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = MONTHS_RU[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

interface PhotoModalProps {
  photo: {
    id: string;
    url: string;
    description: string | null;
    eventDate: string;
    author: { id: string; name: string };
  } | null;
  onClose: () => void;
}

export function PhotoModal({ photo, onClose }: PhotoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!photo) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [photo, handleKeyDown]);

  if (!photo) return null;

  const authorInitial = photo.author.name.charAt(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/90 backdrop-blur-[8px]"
      onClick={onClose}
    >
      <div
        className="modal-enter relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated/80 text-text-muted-light transition-colors hover:text-text-cream"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        <div className="relative max-h-[75vh] max-w-[85vw] overflow-hidden rounded-[var(--radius-md)]">
          <Image
            src={photo.url}
            alt={photo.description ?? ""}
            width={1200}
            height={800}
            className="h-auto max-h-[75vh] w-auto max-w-[85vw] object-contain"
            sizes="85vw"
            priority
          />
        </div>

        <div className="mt-4 w-full max-w-lg px-4 text-center">
          <p className="font-hand text-lg font-bold text-accent-amber">
            {formatDateRu(photo.eventDate)}
          </p>
          {photo.description && (
            <p className="text-body-md mt-2 text-text-cream">
              {photo.description}
            </p>
          )}
          <p className="font-hand mt-2 text-right text-text-muted-light">
            &mdash; {authorInitial}.
          </p>
        </div>
      </div>
    </div>
  );
}
