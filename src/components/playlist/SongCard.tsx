"use client";

import { Music, ExternalLink, Trash2 } from "lucide-react";

interface SongCardProps {
  item: {
    id: string;
    title: string;
    artist: string | null;
    url: string;
    comment: string | null;
    createdAt: string;
    addedBy: { id: string; name: string };
  };
  isOwner: boolean;
  onDelete: (id: string) => void;
}

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const date = new Date(iso).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days === 1) return "вчера";
  if (days < 7) return `${days} дн. назад`;

  const d = new Date(iso);
  const MONTHS = [
    "янв", "фев", "мар", "апр", "мая", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек",
  ];
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function SongCard({ item, isOwner, onDelete }: SongCardProps) {
  return (
    <div className="bg-surface-primary paper-texture rounded-[var(--radius-lg)] border border-border-light shadow-[var(--shadow-card)] card p-5">
      <div className="flex gap-4">
        {/* Music icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-accent-gold/10 rounded-full flex items-center justify-center">
          <Music size={24} className="text-accent-gold" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-body-lg font-medium text-text-dark truncate">
              {item.title}
            </h3>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-gold hover:text-accent-gold-light transition-colors flex-shrink-0"
              aria-label={`Открыть ${item.title}`}
            >
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Artist */}
          {item.artist && (
            <p className="text-body-md text-text-muted-dark">{item.artist}</p>
          )}

          {/* Comment */}
          {item.comment && (
            <div className="mt-2">
              <span className="text-2xl text-accent-rose/30 leading-none mr-1">
                {"\u201C"}
              </span>
              <span className="text-hand-md italic text-accent-rose">
                {item.comment}
              </span>
            </div>
          )}

          {/* Meta row */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-ui-sm text-text-muted-dark">
              Добавил(а) {item.addedBy.name} &middot;{" "}
              {formatRelativeTime(item.createdAt)}
            </span>
            {isOwner && (
              <button
                onClick={() => onDelete(item.id)}
                className="text-text-muted-dark/50 hover:text-accent-rose transition-colors"
                aria-label="Удалить трек"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
