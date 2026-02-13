"use client";

import Image from "next/image";

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

interface TimelineCardProps {
  photo: {
    id: string;
    url: string;
    thumbnail: string | null;
    description: string | null;
    eventDate: string;
    author: { id: string; name: string };
  };
  onClick: () => void;
}

export function TimelineCard({ photo, onClick }: TimelineCardProps) {
  const authorInitial = photo.author.name.charAt(0);
  const imageSrc = photo.thumbnail ?? photo.url;

  return (
    <button
      onClick={onClick}
      className="timeline-card card w-full md:w-64 md:shrink-0 cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-border-light bg-surface-primary shadow-[var(--shadow-card)] text-left"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[12px]">
        <Image
          src={imageSrc}
          alt={photo.description ?? ""}
          fill
          sizes="(max-width: 768px) 80vw, 256px"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <p className="font-hand text-base font-bold text-accent-gold">
          {formatDateRu(photo.eventDate)}
        </p>
        {photo.description && (
          <p className="text-body-sm mt-1 line-clamp-2 text-text-dark">
            {photo.description}
          </p>
        )}
        <p className="font-hand mt-1 text-right text-sm text-text-muted-dark">
          &mdash; {authorInitial}.
        </p>
      </div>
    </button>
  );
}
