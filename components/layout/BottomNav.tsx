"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Sparkles, Mail } from "lucide-react";

const navItems = [
  { href: "/timeline", label: "Лента", icon: Clock },
  { href: "/firsts", label: "Первый раз", icon: Sparkles },
  { href: "/notes", label: "Записки", icon: Mail },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-smooth ${
                isActive
                  ? "text-accent"
                  : "text-text-muted"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
