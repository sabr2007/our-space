"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Sparkles, Mail, TimerIcon } from "lucide-react";

const navItems = [
  { href: "/timeline", label: "Лента", icon: Clock },
  { href: "/firsts", label: "Первый раз", icon: Sparkles },
  { href: "/notes", label: "Записки", icon: Mail },
];

interface TopBarProps {
  daysText: string;
}

export default function TopBar({ daysText }: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/timeline" className="font-display text-xl text-foreground hover:text-accent-warm transition-smooth">
          Our Space
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm transition-smooth ${
                  isActive
                    ? "text-accent"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Days counter */}
        <div className="text-sm text-text-secondary font-display">
          {daysText}
        </div>
      </div>
    </header>
  );
}
