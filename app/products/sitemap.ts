import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

export const revalidate = 3600; // Revalidate every hour (in seconds)

type Product = {
  slug: { current: string };
  _updatedAt: string;
};

const PRODUCTS_SITEMAP_QUERY = groq`
  *[_type == "product" && defined(slug.current)]{
    slug,
    _updatedAt
  }
`;
const lastmod = new Date().toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radharanihandicrafts.com';

  const products: Product[] = await sanityClient.fetch(PRODUCTS_SITEMAP_QUERY);

  return products.map((product) => ({
    url: `${baseUrl}/product/${product.slug.current}`,
    lastModified: lastmod,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
