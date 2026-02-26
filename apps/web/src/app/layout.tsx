import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/shared/AppProviders";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Cleus AI", template: "%s — Cleus AI" },
  description: "Uncensored, multimodal AI. Text, images, video and more.",
  openGraph: {
    siteName: "Cleus AI",
    type: "website",
    images: [{ url: "/og-images/default.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
