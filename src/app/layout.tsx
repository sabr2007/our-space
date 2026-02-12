import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Crimson_Pro,
  Caveat,
  Alegreya_Sans,
} from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const crimson = Crimson_Pro({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-crimson",
});

const caveat = Caveat({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700"],
  variable: "--font-caveat",
});

const alegreya = Alegreya_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-alegreya",
});

export const metadata: Metadata = {
  title: "Our Space",
  description: "Наше пространство",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={`${cormorant.variable} ${crimson.variable} ${caveat.variable} ${alegreya.variable} bg-bg-primary text-text-cream font-body grain-overlay antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
