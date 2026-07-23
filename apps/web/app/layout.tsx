import type { Metadata } from "next";
import { EB_Garamond, Figtree } from "next/font/google";
import "@enzo/design-system/tokens.css";
import "./globals.css";

const editorial = EB_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-eb-garamond-loaded",
});
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree-loaded",
});

export const metadata: Metadata = {
  title: { default: "Enzo", template: "%s · Enzo" },
  description: "Enzo finds what matters. You make the call.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${editorial.variable} ${figtree.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
