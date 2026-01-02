// app/categories/page.tsx
import { client } from "@/sanity.cli";
import { Metadata } from "next";
import CategoryPageHeader from "@/components/categories/CategoryPageHeader";
import CategoryGrid from "@/components/categories/CategoryGrid";
import CategoryPageFooter from "@/components/categories/CategoryPageFooter";
import DecorativeBackground from "@/components/categories/DecorativeBackground";

// Type definition
export interface Category {
  slug: { current: string };
  title: string;
  description?: string;
  image?: string;
}

// SEO Metadata
export const metadata: Metadata = {
  title: "Sacred Marble Deity Categories | RadhaRani Handicraft",
  description:
    "Explore our curated collections of handcrafted marble deity idols. Browse categories of Radha Krishna, Ganesh, Hanuman, and more sacred sculptures crafted by Jaipur artisans.",
  keywords:
    "marble deity categories, handcrafted idols, Jaipur marble sculptures, sacred collections, marble Radha Krishna, marble Ganesh, Hindu deity idols",
  openGraph: {
    title: "Sacred Marble Deity Categories | RadhaRani Handicraft",
    description:
      "Explore our curated collections of handcrafted marble deity idols from Jaipur artisans.",
    type: "website",
    url: "https://radharanihandicrafts.com/categories",
    siteName: "RadhaRani Handicraft",
    locale: "en_IN",
    images: [
      {
        url: "/bg-logo.png",
        width: 1200,
        height: 630,
        alt: "RadhaRani Handicrafts Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sacred Marble Deity Categories | RadhaRani Handicraft",
    description:
      "Explore our curated collections of handcrafted marble deity idols.",
    images: ["/bg-logo.png"],
  },
  alternates: {
    canonical: "https://radharanihandicrafts.com/categories",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// Server-side data fetching
async function getCategories(): Promise<Category[]> {
  try {
    return await client.fetch(
      `*[_type == "category"] | order(title asc) {
        slug,
        title,
        description,
        "image": image.asset->url
      }`,
      {},
      {
        cache: "force-cache",
        next: { revalidate: 3600 },
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoryPage() {
  const categories = await getCategories();

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sacred Marble Deity Categories",
    description:
      "Browse our collections of handcrafted marble deity idols from Jaipur artisans",
    url: "https://radharanihandicrafts.com/categories",
    publisher: {
      "@type": "Organization",
      name: "RadhaRani Handicrafts",
      url: "https://radharanihandicrafts.com",
    },
    numberOfItems: categories.length,
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.title,
      url: `https://radharanihandicrafts.com/category/${category.slug.current}`,
      description: category.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 pt-20 sm:pt-24 lg:pt-28 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <DecorativeBackground />

        <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <CategoryPageHeader />
          <CategoryGrid categories={categories} />
          {categories.length > 0 && <CategoryPageFooter />}
        </div>
      </div>
    </>
  );
}
