import { Metadata } from "next";
import { client } from "@/sanity.cli";
import { getAllProductsQuery } from "@/lib/queries";
import ProductsClient from "@/components/Client Components/ProductsClient";

// SEO Metadata
export const metadata: Metadata = {
  title:
    "Marble Murti & Handcrafted Deity Statues Online | Radha Rani Handicrafts",
  description:
    "Buy premium marble murti, Radha Krishna, Ganesh, Durga & Buddha statues handcrafted in India. Worldwide shipping from Radha Rani Handicrafts.",
  keywords: [
    "marble murti",
    "radha krishna marble murti",
    "handcrafted deity statues",
    "buddha marble murti",
    "ganesh marble murti",
    "radha rani handicrafts",
  ],
  alternates: {
    canonical: "https://radharanihandicrafts.com/products",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Marble Murti Online | Radha Rani Handicrafts",
    description:
      "Premium handcrafted marble deity statues with worldwide delivery.",
    url: "https://radharanihandicrafts.com/products",
    type: "website",
  },
};

export default async function ProductsPage() {
  // Server-side data fetching for SEO
  const [products, categories, materials] = await Promise.all([
    client.fetch(
      getAllProductsQuery,
      {},
      { cache: "force-cache", next: { revalidate: 3600 } },
    ),
    client.fetch(
      `*[_type == "category"] { _id, title, slug }`,
      {},
      { cache: "force-cache", next: { revalidate: 3600 } },
    ),
    client.fetch(
      `*[_type == "Material"] { _id, title }`,
      {},
      { cache: "force-cache", next: { revalidate: 3600 } },
    ),
  ]);
  const prices = products.map((p) => Number(p.price)).filter(Boolean);

  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sacred Artisan Collection",
    description: "Handcrafted marble deity statues and spiritual artifacts",
    numberOfItems: products.length,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsClient
        initialProducts={products}
        categories={categories}
        materials={materials}
      />
    </>
  );
}
