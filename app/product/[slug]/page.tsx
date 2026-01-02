import { getProductBySlugQuery } from "@/lib/queries";
import { client } from "@/sanity.cli";
import { ProductDetail } from "@/components/ProductDetail";

export async function generateMetadata({ params }) {
  const slug = params.slug;

  let product = null;

  try {
    const query = getProductBySlugQuery(slug);
    product = await client.fetch(query);
  } catch (err) {
    console.error(err);
  }

  const canonicalUrl = `https://radharanihandicrafts.com/products/${slug}`;
  const image =
    product?.images?.length
      ? product.images[0]
      : "https://radharanihandicrafts.com/placeholder-product.jpg";

  return {
    title: product?.name || "Product Detail | Radha Rani Handicrafts",
    description:
      product?.description ||
      "Handcrafted marble idols by Radha Rani Handicrafts.",

    alternates: {
      canonical: canonicalUrl, // ✅ CORRECT PLACE
    },

    openGraph: {
      title: product?.name,
      description: product?.description,
      url: canonicalUrl, // ✅ MATCHES CANONICAL
      siteName: "Radha Rani Handicrafts",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product?.name,
        },
      ],
      type: "product",
    },

    twitter: {
      card: "summary_large_image",
      title: product?.name,
      description: product?.description,
      images: [image],
    },
  };
          }

export default async function ProductDetailPage({ params }) {
  const awaitedParams = await params;  // Await params here
  const slug = awaitedParams.slug;

  let product = null;

  if (slug) {
    try {
      const query = getProductBySlugQuery(slug);
      product = await client.fetch(query);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  return <ProductDetail product={product} />;
}
