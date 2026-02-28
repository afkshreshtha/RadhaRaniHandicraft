import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

export const revalidate = 3600; // Revalidate every hour (in seconds)

type Post = {
  slug: { current: string };
  _updatedAt: string;
};

const POST_SITEMAP_QUERY = groq`
  *[_type == "post" && defined(slug.current)]{
    slug,
    _updatedAt
  }
`;
const lastmod = new Date().toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radharanihandicrafts.com';

  const post: Post[] = await sanityClient.fetch(POST_SITEMAP_QUERY);

  return post.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: lastmod,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
