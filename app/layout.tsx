import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./provider/providers";

const SITE_URL = "https://radharanihandicrafts.com";

export const metadata: Metadata = {
  // ── metadataBase is REQUIRED for relative OG image URLs to resolve ──────────
  metadataBase: new URL(SITE_URL),

  // ── Title with template so blog/product pages auto-get brand suffix ─────────
  title: {
    default: "RadhaRani Handicrafts – Handcrafted Marble Deity Idols",
    template: "%s | RadhaRani Handicrafts",
  },

  description:
    "Discover premium handcrafted marble idols and murtis of Hindu deities like Radha Krishna, Shiva, Ganesh, and more. Ideal for home temples, mandirs, and devotional gifting.",

  keywords: [
    "marble murti",
    "deity idols",
    "hindu god statues",
    "marble god idols",
    "handmade idols",
    "Radha Krishna idol",
    "Hanuman statue",
    "Ganesha idol",
    "puja room decor",
    "radharanihandicrafts",
  ],

  authors: [{ name: "RadhaRani Handicrafts", url: SITE_URL }],

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
    },
  },

  openGraph: {
    title: "RadhaRani Handicrafts – Handcrafted Marble Deity Idols",
    description:
      "Elegant and devotional marble deity idols for your home and temple. Handcrafted with devotion.",
    url: SITE_URL,
    siteName: "RadhaRani Handicrafts",
    locale: "en_IN",           // changed from en_US — your audience is India
    type: "website",
    images: [
      {
        url: "/bg-logo.png",   // relative — metadataBase resolves this automatically
        width: 1200,
        height: 630,
        alt: "RadhaRani Handicrafts – Handcrafted Marble Deity Idols",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "RadhaRani Handicrafts – Handcrafted Marble Deity Idols",
    description:
      "Premium handcrafted marble idols for home temples and devotional gifting.",
    images: ["/bg-logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Viewport — must be in <head>, not in metadata export in Next.js 14+ */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-sans">
        <Navbar />
        <SpeedInsights />
        <Analytics />

        {/* ── Organization Schema ── */}
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "RadhaRani Handicrafts",
              url: SITE_URL,                          // fixed: was radharanihandicraft.com (typo)
              logo: `${SITE_URL}/bg-logo.png`,
              sameAs: [
                "https://www.facebook.com/radharanihandicraft",
                "https://www.instagram.com/radharanihandicraft",
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+91-82733-66089",
                  contactType: "Customer Service",
                  areaServed: "IN",
                  availableLanguage: ["English", "Hindi"],
                },
              ],
            }),
          }}
        />

        {/* ── Website Search Schema (enables Google Sitelinks searchbox) ── */}
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "RadhaRani Handicrafts",
              url: SITE_URL,
            }),
          }}
        />

        <Providers>
          <main className="pt-16 sm:pt-20 lg:pt-24">{children}</main>
        </Providers>

        <Footer />
      </body>
    </html>
  );
}