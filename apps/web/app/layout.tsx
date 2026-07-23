import type { Metadata } from "next";
import { Fragment_Mono, Inter_Tight, Lora } from "next/font/google";
import "@enzo/design-system/tokens.css";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], weight: ["400"], variable: "--font-lora" });
const inter = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter-tight",
});
const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fragment-mono",
});

export const metadata: Metadata = {
  title: { default: "Enzo", template: "%s · Enzo" },
  description: "Interrogate the experience. Extract the signal. Ship the right thing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${lora.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
