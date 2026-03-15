import "@/styles/globals.css";
import type { Metadata } from "next";
import AppShell from "./shell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cherajama",
    template: "%s | Cherajama"
  },
  description: "Shop premium apparel, curated collections, and seasonal essentials.",
  openGraph: {
    type: "website",
    siteName: "Cherajama",
    url: siteUrl,
    title: "Cherajama",
    description: "Shop premium apparel, curated collections, and seasonal essentials.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Cherajama apparel"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cherajama",
    description: "Shop premium apparel, curated collections, and seasonal essentials.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
