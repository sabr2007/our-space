"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Mail, Music, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/timeline", label: "Моменты", icon: Camera },
  { href: "/notes", label: "Записки", icon: Mail },
  { href: "/playlist", label: "Музыка", icon: Music },
  { href: "/settings", label: "Ещё", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 pb-[env(safe-area-inset-bottom)] bg-bg-secondary/95 backdrop-blur-[12px] border-t border-border-dark z-50">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 relative ${
                isActive ? "text-accent-gold" : "text-text-muted-light"
              }`}
            >
              <item.icon size={20} strokeWidth={1.5} />
              {item.href === "/notes" && (
                <span className="absolute -top-0.5 -right-1.5 w-2 h-2 bg-accent-rose rounded-full" />
              )}
              <span className="text-[11px] font-ui">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
