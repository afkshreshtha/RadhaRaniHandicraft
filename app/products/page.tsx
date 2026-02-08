import { Metadata } from "next";
import { client } from "@/sanity.cli";
import { getAllProductsQuery } from "@/lib/queries";
import ProductsClient from "@/components/Client Components/ProductsClient";

// SEO Metadata
export const metadata: Metadata = {
  title: "Sacred Artisan Collection - Handcrafted Marble Deity Statues | RadhaRani Handicrafts",
  description: "Discover premium handcrafted marble deity statues and spiritual artifacts. Shop from our collection of full paint and half paint religious sculptures with custom dimensions.",
  keywords: "marble statues, deity statues, handcrafted sculptures, spiritual artifacts, RadhaRani Handicrafts",
  openGraph: {
    title: "Sacred Artisan Collection - Handcrafted Spiritual Artifacts",
    description: "Premium handcrafted marble deity statues and religious sculptures",
    type: "website",
  },
};

export default async function ProductsPage() {
  // Server-side data fetching for SEO
  const [products, categories, materials] = await Promise.all([
    client.fetch(getAllProductsQuery, {}, { cache: 'force-cache', next: { revalidate: 3600 } }),
    client.fetch(`*[_type == "category"] { _id, title, slug }`, {}, { cache: 'force-cache', next: { revalidate: 3600 } }),
    client.fetch(`*[_type == "Material"] { _id, title }`, {}, { cache: 'force-cache', next: { revalidate: 3600 } })
  ]);

  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Sacred Artisan Collection",
    "description": "Handcrafted marble deity statues and spiritual artifacts",
    "numberOfItems": products.length,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": Math.min(...products.map(p => parseFloat(p.price))),
      "highPrice": Math.max(...products.map(p => parseFloat(p.price))),
    }
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
