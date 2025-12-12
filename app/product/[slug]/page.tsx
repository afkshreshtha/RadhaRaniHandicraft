import { getProductBySlugQuery } from "@/lib/queries";
import { client } from "@/sanity.cli";
import { ProductDetail } from "@/components/ProductDetail";

export async function generateMetadata({ params }) {
  const awaitedParams = await params;  // Await params here
  const slug = awaitedParams.slug;

  let product = null;

  try {
    const query = getProductBySlugQuery(slug);
    product = await client.fetch(query);
  } catch {
    // handle error
  }

  return {
    title: product?.name || "Product Detail",
    description: product?.description || "View details for this product.",
    openGraph: {
      title: product?.name,
      description: product?.description,
          images: [
      {
        url: product?.images?.length ? [product.images[0]] : ["/placeholder-product.jpg"],
        width: 1200,
        height: 630,
        alt: "RadhaRani Handicraft – Handcrafted Marble Idols",
      },
    ],
      url: `https://radharanihandicraft.vercel.app/product/${slug}`,
      type: "website",  // Correct og:type
    },
    twitter: {
      card: "summary_large_image",
      title: product?.name,
      description: product?.description,
      images: product?.images?.length ? [product.images[0]] : ["/placeholder-product.jpg"],
    },
    canonical: `https://yourdomain.com/product/${slug}`,
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
