import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
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
