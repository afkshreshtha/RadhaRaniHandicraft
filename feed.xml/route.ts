import { client } from "@/sanity/lib/client"; // adjust path to your Sanity client

export const revalidate = 3600; // Refresh feed every 1 hour

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
const products = await client.fetch(`
  *[_type == "product" && defined(slug.current)] {
    _id,
    "title": coalesce(title, name, productName),
    "slug": slug.current,
    "description": coalesce(pt::text(description), description),
    price,
    "imageUrl": coalesce(images[0].asset->url, image.asset->url)
  }
`);

  const siteUrl = "https://radharanihandicrafts.com";

const items = products
  .filter((p) => p.imageUrl && p.price > 0)
  .map((p) => {
    const cleanDescription = (p.description || p.title)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    return `
      <item>
        <g:id>${escapeXml(p._id)}</g:id>
        <g:title>${escapeXml(p.title)}</g:title>
        <g:description>${escapeXml(cleanDescription)}</g:description>
        <g:link>${siteUrl}/product/${escapeXml(p.slug)}</g:link>
        <g:image_link>${escapeXml(p.imageUrl)}?fm=jpg&amp;w=1200&amp;q=85</g:image_link>
        <g:availability>in_stock</g:availability>
        <g:condition>new</g:condition>
        <g:price>${Number(p.price).toFixed(2)} INR</g:price>
        <g:brand>Radha Rani Handicrafts</g:brand>
        <g:identifier_exists>no</g:identifier_exists>
      </item>`;
  })
  .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Radha Rani Handicrafts</title>
    <link>${siteUrl}</link>
    <description>Handcrafted Marble Murtis and Idols</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
