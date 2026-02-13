"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Mail, Music, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/timeline", label: "Моменты", icon: Camera },
  { href: "/notes", label: "Записки", icon: Mail },
  { href: "/playlist", label: "Музыка", icon: Music },
  { href: "/settings", label: "Настройки", icon: Settings },
];

interface SidebarProps {
  user?: {
    name: string;
    avatar: string | null;
    mood: { emoji: string } | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <aside className="w-60 min-h-screen bg-bg-secondary border-r border-border-dark flex flex-col">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="font-display font-bold text-2xl text-text-cream text-center">
          Our Space
        </h1>
        <div className="flex items-center justify-center gap-1 mt-2 text-sm">
          <span className="text-accent-gold/60">───</span>
          <span className="text-accent-rose">♡</span>
          <span className="text-accent-gold/60">───</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-lg font-ui text-[15px] font-medium transition-colors duration-200 ${
                isActive
                  ? "text-text-cream bg-[rgba(200,148,63,0.15)]"
                  : "text-text-muted-light hover:text-text-cream"
              }`}
            >
              <item.icon
                size={20}
                strokeWidth={1.5}
                className={isActive ? "text-accent-gold" : ""}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div className="px-4 py-5 border-t border-border-dark">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-border-dark object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-bg-elevated border-2 border-border-dark flex items-center justify-center text-text-muted-light font-ui text-sm">
              {initial}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-ui text-sm text-text-cream truncate">
              {user?.name ?? "Пользователь"}
            </span>
            <span className="text-xs text-text-muted-light truncate">
              {user?.mood?.emoji ?? "настроение..."}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
