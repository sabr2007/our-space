"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PenLine, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NoteComposer } from "@/components/notes/NoteComposer";
import { NoteView } from "@/components/notes/NoteView";

interface NoteItem {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  author: { id: string; name: string };
  recipient: { id: string; name: string };
}

interface NotesListProps {
  sent: NoteItem[];
  received: NoteItem[];
  partnerName: string;
  currentUserId: string;
}

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month}, ${hours}:${minutes}`;
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

export function NotesList({
  sent,
  received,
  partnerName,
  currentUserId,
}: NotesListProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const handleComposeSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleBack = useCallback(() => {
    setSelectedNote(null);
    router.refresh();
  }, [router]);

  const notes = activeTab === "received" ? received : sent;
  const unreadCount = received.filter((n) => !n.isRead).length;

  // If a note is selected, show the NoteView
  if (selectedNote) {
    return (
      <div className="py-8 md:py-12 max-w-2xl">
        <NoteView
          note={selectedNote}
          currentUserId={currentUserId}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 space-y-6">
      {/* Header */}
      <div className="stagger-1 flex items-center justify-between">
        <h1 className="text-display-lg text-text-cream">Записки</h1>
        <Button onClick={() => setComposerOpen(true)}>
          <span className="inline-flex items-center gap-2">
            <PenLine size={18} />
            Написать
          </span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="stagger-2 flex gap-6 border-b border-border-dark">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-2 py-3 font-ui text-[15px] transition-colors relative min-h-[44px] ${
            activeTab === "received"
              ? "text-text-cream"
              : "text-text-muted-light hover:text-text-cream"
          }`}
        >
          Полученные
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-rose text-white text-[11px] font-ui font-semibold">
              {unreadCount}
            </span>
          )}
          {activeTab === "received" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-gold" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-2 py-3 font-ui text-[15px] transition-colors relative min-h-[44px] ${
            activeTab === "sent"
              ? "text-text-cream"
              : "text-text-muted-light hover:text-text-cream"
          }`}
        >
          Отправленные
          {activeTab === "sent" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-gold" />
          )}
        </button>
      </div>

      {/* Notes list */}
      <div className="stagger-3 space-y-3">
        {notes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail size={48} className="text-text-muted-light/40 mb-4" />
            <p className="text-display-sm text-text-muted-light mb-2">
              {activeTab === "received"
                ? "Пока нет полученных записок"
                : "Вы ещё не отправляли записок"}
            </p>
            <p className="text-body-sm text-text-muted-light/60 mb-6">
              {activeTab === "received"
                ? `Когда ${partnerName} напишет вам, записка появится здесь`
                : `Напишите что-нибудь тёплое для ${partnerName}`}
            </p>
            {activeTab === "sent" && (
              <Button onClick={() => setComposerOpen(true)}>
                <span className="inline-flex items-center gap-2">
                  <PenLine size={18} />
                  Написать записку
                </span>
              </Button>
            )}
          </div>
        ) : (
          notes.map((note, index) => {
            const isUnread = !note.isRead && activeTab === "received";
            return (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="w-full text-left"
                style={{
                  animation: `noteUnfold 400ms var(--ease-smooth) ${index * 60}ms both`,
                }}
              >
                <div
                  className={`
                    card bg-surface-primary paper-texture rounded-[var(--radius-lg)]
                    border border-border-light p-5 shadow-[var(--shadow-card)]
                    ${isUnread ? "border-l-[3px] border-l-accent-gold" : ""}
                  `}
                  style={
                    isUnread
                      ? { boxShadow: "var(--shadow-card), 0 0 20px rgba(200, 148, 63, 0.1)" }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        ${isUnread ? "bg-accent-gold/10" : "bg-surface-secondary"}
                      `}
                    >
                      {isUnread ? (
                        <Mail size={18} className="text-accent-gold" />
                      ) : (
                        <MailOpen size={18} className="text-text-muted-dark" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <p className={`text-body-md font-medium truncate ${isUnread ? "text-text-dark" : "text-text-muted-dark"}`}>
                          {activeTab === "received"
                            ? `От ${note.author.name}`
                            : `Для ${note.recipient.name}`}
                        </p>
                        <p className="text-ui-sm text-text-muted-dark whitespace-nowrap flex-shrink-0">
                          {formatShortDate(note.createdAt)}
                        </p>
                      </div>
                      <p className={`text-body-sm truncate ${isUnread ? "text-text-dark/70" : "text-text-muted-dark"}`}>
                        {truncate(note.content, 100)}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Composer Modal */}
      <NoteComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSuccess={handleComposeSuccess}
        partnerName={partnerName}
      />
    </div>
  );
}
