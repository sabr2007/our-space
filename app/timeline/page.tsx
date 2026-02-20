import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { desc } from "drizzle-orm";
import AppShell from "@/components/layout/AppShell";
import DayCounter from "@/components/layout/DayCounter";
import { getRelationshipText } from "@/lib/utils";

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

  const startDate = new Date(process.env.RELATIONSHIP_START_DATE || "2024-08-25");
  const daysText = getRelationshipText(startDate);

  return (
    <AppShell daysText={daysText}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl md:text-5xl text-center mb-12">
          Наше путешествие
        </h1>

        {/* Timeline placeholder - will add GSAP horizontal scroll later */}
        <div className="space-y-8">
          {allEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted mb-4">
                Ещё нет событий. Начните добавлять ваши воспоминания!
              </p>
              <button className="px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent-warm transition-smooth">
                + Добавить событие
              </button>
            </div>
          ) : (
            allEvents.map((event) => (
              <div
                key={event.id}
                className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition-smooth"
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
    </AppShell>
  );
}
