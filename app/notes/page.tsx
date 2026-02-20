import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notes, users } from "@/lib/schema";
import { desc, eq, or, and } from "drizzle-orm";

export default async function NotesPage() {
  const userId = await getCurrentUser();
  
  if (!userId) {
    return <div>Not authenticated</div>;
  }

  // Get partner ID
  const partnerId = userId === 1 ? 2 : 1;

  // Fetch all notes between the couple
  const allNotes = await db
    .select({
      note: notes,
      author: users,
    })
    .from(notes)
    .leftJoin(users, eq(notes.authorId, users.id))
    .where(
      or(
        and(eq(notes.authorId, userId)),
        and(eq(notes.authorId, partnerId))
      )
    )
    .orderBy(desc(notes.createdAt));

  // Separate sent and received
  const sentNotes = allNotes.filter((n) => n.note.authorId === userId);
  const receivedNotes = allNotes.filter((n) => n.note.authorId === partnerId);
  const unreadCount = receivedNotes.filter((n) => !n.note.isRead).length;

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-display text-2xl text-center">Записки</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 container mx-auto px-4 max-w-4xl pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm bg-accent text-background rounded-full">
                {unreadCount} новых
              </span>
            )}
          </div>
          <button className="px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent-warm transition-smooth">
            Написать записку
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-border mb-8">
          <button className="pb-3 font-medium text-foreground border-b-2 border-accent">
            Полученные ({receivedNotes.length})
          </button>
          <button className="pb-3 font-medium text-text-muted hover:text-foreground transition-smooth">
            Отправленные ({sentNotes.length})
          </button>
        </div>

        {/* Notes list */}
        <div className="space-y-4">
          {receivedNotes.length === 0 ? (
            <p className="text-center text-text-muted py-12">
              Пока нет записок
            </p>
          ) : (
            receivedNotes.map((item) => (
              <div
                key={item.note.id}
                className={`bg-surface border ${
                  !item.note.isRead ? "border-accent glow-rose" : "border-border"
                } rounded-lg p-6 transition-smooth`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-foreground">
                      От {item.author?.name}
                    </div>
                    <div className="text-sm text-text-muted">
                      {new Date(item.note.createdAt).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  {!item.note.isRead && (
                    <span className="text-xs bg-accent text-background px-2 py-1 rounded-full">
                      Новая
                    </span>
                  )}
                </div>
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {item.note.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
