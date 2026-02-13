"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { markNoteAsRead } from "@/actions/notes";

interface NoteItem {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  author: { id: string; name: string };
  recipient: { id: string; name: string };
}

interface NoteViewProps {
  note: NoteItem;
  currentUserId: string;
  onBack: () => void;
}

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function NoteView({ note, currentUserId, onBack }: NoteViewProps) {
  const markedRef = useRef(false);
  const [isRead, setIsRead] = useState(note.isRead);

  // Mark as read when viewing unread received note
  useEffect(() => {
    if (
      !markedRef.current &&
      !note.isRead &&
      note.recipient.id === currentUserId
    ) {
      markedRef.current = true;
      markNoteAsRead(note.id);
      setIsRead(true);
    }
  }, [note.id, note.isRead, note.recipient.id, currentUserId]);

  const isReceived = note.recipient.id === currentUserId;

  return (
    <div className="note-card-enter space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-accent-gold hover:text-accent-gold-light font-ui text-[15px] transition-colors"
      >
        <ArrowLeft size={18} />
        Назад к запискам
      </button>

      {/* Letter card */}
      <div className="bg-surface-primary paper-texture rounded-[var(--radius-lg)] border border-border-light shadow-[var(--shadow-card)] p-6 sm:p-8 md:p-10">
        {/* Note content */}
        <div className="text-body-lg text-text-dark whitespace-pre-wrap mb-8">
          {note.content}
        </div>

        {/* Author signature */}
        <div className="text-right mb-6">
          <p className="text-hand-lg text-accent-rose">
            С любовью,
          </p>
          <p className="text-hand-lg text-accent-rose">
            {note.author.name}
          </p>
        </div>

        {/* Divider + date */}
        <div className="border-t border-border-light pt-4">
          <p className="text-ui-sm text-text-muted-dark">
            {formatDate(note.createdAt)}
            {isReceived && !isRead && (
              <span className="ml-2 text-accent-gold">Новая</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
