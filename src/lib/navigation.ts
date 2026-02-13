import { Home, Camera, Mail, Music, Settings } from "lucide-react";

export const navItems = [
  { href: "/", label: "Главная", shortLabel: "Главная", icon: Home },
  { href: "/timeline", label: "Моменты", shortLabel: "Моменты", icon: Camera },
  { href: "/notes", label: "Записки", shortLabel: "Записки", icon: Mail },
  { href: "/playlist", label: "Музыка", shortLabel: "Музыка", icon: Music },
  { href: "/settings", label: "Настройки", shortLabel: "Ещё", icon: Settings },
];
