import { getProductBySlugQuery } from "@/lib/queries";
import { client } from "@/sanity.cli";
import { ProductDetail } from "@/components/ProductDetail";
import { notFound } from "next/navigation";

const SITE_BASE_URL = "https://radharanihandicrafts.com";
const PLACEHOLDER_IMAGE = "/placeholder-product.jpg";
const SITE_NAME = "RadhaRani Handicrafts";
const DEFAULT_TITLE = "Handcrafted Marble Deity Idols | RadhaRani Handicrafts";
const DEFAULT_DESCRIPTION =
  "Handcrafted by Jaipur's master artisans, our marble deities embody centuries of sacred tradition with authentic marble.";

export async function generateMetadata({ params }) {
  const awaitedParams =
    (params ?? {}) && typeof params.then === "function" ? await params : params;
  const slug = String(awaitedParams?.slug ?? "").trim();

  let product = null;

  try {
    const query = getProductBySlugQuery(slug);
    product = await client.fetch(query);
  } catch (e) {
    console.error(`Error fetching product metadata for slug: ${slug}`, e);
  }

  // If no product found, return default metadata for 404 page
  if (!product) {
    return {
      title: `Product Not Found | ${SITE_NAME}`,
      description: "The product you're looking for could not be found.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = product.name ? `${product.name} | ${SITE_NAME}` : DEFAULT_TITLE;
  const description = product.description?.slice(0, 160) || DEFAULT_DESCRIPTION;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [PLACEHOLDER_IMAGE];
  const imageUrl = images[0]?.startsWith("http")
    ? images[0]
    : `${SITE_BASE_URL}${images[0]}`;

  const ogUrl = `${SITE_BASE_URL}/product/${slug}`;

  return {
    title,
    description,
    keywords:
      product.tags?.join(", ") ||
      "marble idols, handcrafted deities, Jaipur marble crafts",

    openGraph: {
      title: product.name || DEFAULT_TITLE,
      description,
      type: "website",
      url: ogUrl,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name || "Handcrafted Marble Deity Idol",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name || DEFAULT_TITLE,
      description,
      images: [imageUrl],
    },

    alternates: {
      canonical: ogUrl,
    },

    robots: {
      index: true,
      follow: true,
      maxImagePreview: "large",
      maxSnippet: -1,
      maxVideoPreview: -1,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  let product = null;

  if (!slug) {
    notFound(); // Trigger 404 if no slug
  }

  try {
    const query = getProductBySlugQuery(slug);
    product = await client.fetch(query);
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound(); // Trigger 404 on fetch error
  }

  // If product not found, trigger Next.js 404
  if (!product) {
    notFound();
  }

  // Build JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image:
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : `${SITE_BASE_URL}${PLACEHOLDER_IMAGE}`,
    url: `${SITE_BASE_URL}/product/${slug}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    ...(product.price && {
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_BASE_URL}/product/${slug}`,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
