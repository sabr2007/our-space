import { db } from "@/lib/db";
import { firsts } from "@/lib/schema";
import { asc } from "drizzle-orm";

export default async function FirstsPage() {
  // Fetch all "first times"
  const allFirsts = await db
    .select()
    .from(firsts)
    .orderBy(asc(firsts.sortOrder), asc(firsts.createdAt));

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-display text-2xl text-center">
            Первый раз когда...
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 container mx-auto px-4 max-w-4xl pb-20">
        {/* Add button */}
        <div className="flex justify-end mb-12">
          <button className="px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent-warm transition-smooth">
            + Добавить
          </button>
        </div>

        {/* Infinite list */}
        <div className="space-y-12">
          {allFirsts.length === 0 ? (
            <p className="text-center text-text-muted py-12">
              Ещё нет записей. Добавьте первую!
            </p>
          ) : (
            allFirsts.map((first, index) => (
              <div
                key={first.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center"
              >
                {/* Left: Title */}
                <div className="text-right md:pr-8">
                  <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
                    Первый раз когда {first.title}
                  </h2>
                </div>

                {/* Center: Divider */}
                <div className="hidden md:block w-px h-full bg-border" />

                {/* Right: Description + Date */}
                <div className="md:pl-8">
                  {first.date && (
                    <div className="text-sm text-text-muted mb-2">
                      {new Date(first.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  )}
                  {first.description && (
                    <p className="text-text-secondary leading-relaxed">
                      {first.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom spacing for better scroll */}
        <div className="h-24" />
      </div>
    </div>
  );
}
