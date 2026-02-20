import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Space",
  description: "A private space for two",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
