import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "lookie/lookie.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Lookie - The section-following mascot for web apps",
  description: "An open-source SVG mascot that follows reading sections while its pupils track your cursor. Zero dependencies.",
  openGraph: {
    title: "Lookie - The section-following mascot for web apps",
    description: "An open-source SVG mascot that follows reading sections while its pupils track your cursor. Zero dependencies.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Lookie mascot" }],
  },
  icons: {
    icon: "/mascot.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased selection:bg-accent/10">
        {children}
      </body>
    </html>
  );
}
