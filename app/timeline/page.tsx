import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { desc } from "drizzle-orm";

export default async function TimelinePage() {
  const userId = await getCurrentUser();
  
  if (!userId) {
    return <div>Not authenticated</div>;
  }

  // Fetch events
  const allEvents = await db
    .select()
    .from(events)
    .orderBy(desc(events.date));

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-foreground">Our Space</h1>
          <div className="text-text-secondary text-sm">
            {/* Days counter placeholder */}
            547 дней вместе
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 container mx-auto px-4">
        <h2 className="font-display text-4xl text-center mb-12">
          Наше путешествие
        </h2>

        {/* Timeline placeholder */}
        <div className="space-y-8">
          {allEvents.length === 0 ? (
            <p className="text-center text-text-muted">
              No events yet. Start adding your memories!
            </p>
          ) : (
            allEvents.map((event) => (
              <div
                key={event.id}
                className="bg-surface border border-border rounded-lg p-6"
              >
                <div className="text-sm text-text-muted mb-2">{event.date}</div>
                <h3 className="font-display text-2xl mb-2">{event.title}</h3>
                {event.description && (
                  <p className="text-text-secondary">{event.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
