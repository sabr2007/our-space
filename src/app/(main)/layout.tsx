import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { name: string; avatar: string | null; mood: { emoji: string } | null } | undefined;

  try {
    const session = await auth();
    if (session?.user?.id) {
      const [dbUser, latestMood] = await Promise.all([
        db.user.findUnique({
          where: { id: session.user.id },
          select: { name: true, avatar: true },
        }),
        db.mood.findFirst({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
          select: { emoji: true },
        }),
      ]);

      if (dbUser) {
        user = {
          name: dbUser.name,
          avatar: dbUser.avatar,
          mood: latestMood,
        };
      }
    }
  } catch {
    // Silently fail — sidebar will show default placeholder
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* Content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[960px] mx-auto px-4 pb-24 md:pb-8 md:px-8 lg:px-12">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="block md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
