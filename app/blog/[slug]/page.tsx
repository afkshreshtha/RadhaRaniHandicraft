import { notFound } from "next/navigation"

import BlogDetailClient from "@/components/BlogDetailClient"
import { client } from "@/sanity.cli"
import { urlFor } from "@/sanity/lib/image"
import { Metadata } from "next"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://radharanihandicrafts.com"
const SITE_NAME = "Radha Rani Handicrafts"
async function getPost(slug: string) {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt,
      "category": categories[0]->title,
      "readTime": round(length(pt::text(content)) / 5 / 180),
      content,
      "author": author-> {
        name,
        image,
        bio
      },
      "relatedPosts": *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0..2] {
        _id,
        title,
        slug,
        excerpt,
        featuredImage,
        publishedAt,
        "category": categories[0]->title,
        "readTime": round(length(pt::text(content)) / 5 / 180)
      }
    }`,
    { slug }
  )
}

async function getPostSEO(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt,
      metaDescription,
      featuredImage,
      publishedAt,
      slug,
      category,
      "author": author->name
    }`,
    { slug }
  )
}
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const {slug} =  await params
  const post = await getPostSEO(slug)


  if (!post) {
    return {
      title: `Post Not Found | ${SITE_NAME}`,
    }
  }

  // Use metaDescription first, fall back to excerpt, then title
  const description =
    post.metaDescription ||
    post.excerpt ||
    `Read about ${post.title} on the ${SITE_NAME} blog.`

  const canonicalUrl = `${SITE_URL}/blog/${post.slug.current}`

  const ogImage = post.featuredImage
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : `${SITE_URL}/og-default.jpg`   // fallback OG image

  return {
    // ── Basic ──────────────────────────────────────────────────────────────
    title: `${post.title} | ${SITE_NAME}`,
    description,

    // ── Canonical ──────────────────────────────────────────────────────────
    alternates: {
      canonical: canonicalUrl,
    },

    // ── Open Graph (Facebook, WhatsApp, LinkedIn) ──────────────────────────
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : [SITE_NAME],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    // ── Twitter Card ───────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },

    // ── Robots ─────────────────────────────────────────────────────────────
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
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return <BlogDetailClient post={post} />  // ← no urlFor prop
}