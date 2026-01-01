import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radharanihandicrafts.com';

  const products: Product[] = await sanityClient.fetch(PRODUCTS_SITEMAP_QUERY);

  return products.map((product) => ({
    url: `${baseUrl}/product/${product.slug.current}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
