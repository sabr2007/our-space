"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

interface UnreadNotesCardProps {
  unreadCount: number;
}

function pluralizeNotes(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return "новых записок";
  if (mod10 === 1) return "новая записка";
  if (mod10 >= 2 && mod10 <= 4) return "новые записки";
  return "новых записок";
}

export function UnreadNotesCard({ unreadCount }: UnreadNotesCardProps) {
  const hasUnread = unreadCount > 0;

  return (
    <Link href="/notes" className="block">
      <div
        className={`
          card bg-surface-primary paper-texture rounded-[var(--radius-lg)]
          border border-border-light p-6 shadow-[var(--shadow-card)]
          ${hasUnread ? "border-l-[3px] border-l-accent-gold" : ""}
        `}
        style={
          hasUnread
            ? { boxShadow: "var(--shadow-card), 0 0 20px rgba(200, 148, 63, 0.1)" }
            : undefined
        }
      >
        <div className="flex items-start gap-4">
          <div
            className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${hasUnread ? "bg-accent-gold/10" : "bg-surface-secondary"}
            `}
          >
            <Mail
              size={20}
              className={
                hasUnread ? "text-accent-gold" : "text-text-muted-dark"
              }
            />
          </div>
          <div>
            <p className="text-body-md text-text-dark font-medium">
              {hasUnread
                ? `${unreadCount} ${pluralizeNotes(unreadCount)}`
                : "Нет новых записок"}
            </p>
            {hasUnread && (
              <p className="text-ui-sm text-accent-gold mt-1">
                Нажми, чтобы прочитать &rarr;
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
