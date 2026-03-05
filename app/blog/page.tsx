import BlogPage from "@/components/BlogPost";
import { client } from "@/sanity.cli";
import type { Metadata } from "next";

// ── SEO Metadata ──────────────────────────────────────────────────────────────
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://radharanihandicrafts.com";
const SITE_NAME = "Radha Rani Handicrafts";

export const metadata: Metadata = {
  title: "Blog", // template in layout.tsx adds "| Radha Rani Handicrafts" automatically
  description:
    "Explore articles on Radha Krishna idols, Hanuman statues, puja room setup, brass vs marble idols, and the spiritual significance of Indian handicrafts.",

  alternates: {
    canonical: `${SITE_URL}/blog`,
  },

  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      "Explore articles on Radha Krishna idols, Hanuman statues, puja room setup, brass vs marble idols, and the spiritual significance of Indian handicrafts.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Blog`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `Blog | ${SITE_NAME}`,
    description:
      "Articles on Indian spiritual handicrafts, idol significance, and sacred home décor.",
    images: [`${SITE_URL}/og-blog.jpg`],
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

// ── Data Fetching ─────────────────────────────────────────────────────────────
async function getPosts() {
  return await client.fetch(
    `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      metaDescription,
      featuredImage,
      publishedAt,
      "category": categories[0]->title,
      "readTime": round(length(pt::text(content)) / 5 / 180)
    }
      
  `,
    {},
   { next: { tags: ["post"], revalidate: 60 } },
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function Page() {
  const posts = await getPosts();
  return <BlogPage posts={posts} />;
}
