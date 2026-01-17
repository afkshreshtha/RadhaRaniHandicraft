import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

export const revalidate = 3600; // Revalidate every hour (in seconds)

type Category = {
  slug: { current: string };
  _updatedAt: string;
};

const Category_SITEMAP_QUERY = groq`
  *[_type == "category" && defined(slug.current)]{
    slug,
    _updatedAt
  }
`;
const lastmod = new Date().toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radharanihandicrafts.com';

  const Categorys: Category[] = await sanityClient.fetch(Category_SITEMAP_QUERY);

  return Categorys.map((Category) => ({
    url: `${baseUrl}/category/${Category.slug.current}`,
    lastModified: lastmod,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
