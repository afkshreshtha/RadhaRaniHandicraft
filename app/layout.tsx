import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./provider/providers";
export const metadata: Metadata = {
  title: "RadhaRani Handicraft – Handcrafted Marble Deity Idols",
  description:
    "Discover premium handcrafted marble idols and murtis of Hindu deities like Radha Krishna, Shiva, Ganesh, and more by Radharani Handicrafts. Ideal for home temples, mandirs, and devotional gifting.",
  keywords:
    "marble murti, deity idols, hindu god statues, marble god idols, handmade idols, radharanihandicraft",
  authors: [{ name: "radharanihandicrafts" }],
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  themeColor: "#ffffff",
  alternates: {
    canonical: "https://radharanihandicrafts.com",
    languages: {
      "en-US": "https://radharanihandicrafts.com",
    },
  },
  openGraph: {
    title: "RadhaRani Handicraft – Handcrafted Marble Idols",
    description:
      "Elegant and devotional marble deity idols for your home and temple.",
    url: "https://radharanihandicrafts.com",
    siteName: "RadhaRani Handicrafts",
    images: [
      {
        url: "https://radharanihandicrafts.com/bg-logo.png",
        width: 1200,
        height: 630,
        alt: "RadhaRani Handicrafts – Handcrafted Marble Idols",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Navbar />
        <SpeedInsights />
        <Analytics />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RadhaRani Handicraft",
              "url": "https://radharanihandicraft.com",
              "logo": "https://radharanihandicrafts.com/bg-logo.png",
              "sameAs": [
                "https://www.facebook.com/radharanihandicraft",
                "https://www.instagram.com/radharanihandicraft"
              ],
"contactPoint": [
  {
    "@type": "ContactPoint",
    "telephone": "+91 82733 66089",
    "contactType": "Customer Service"
  }
]

            }
          `}
        </Script>

        <Providers>{children}</Providers>

        <Footer />
      </body>
    </html>
  );
}
