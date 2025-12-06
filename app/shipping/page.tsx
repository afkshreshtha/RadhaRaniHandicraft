// pages/shipping-policy.tsx
import Head from "next/head";
import Link from "next/link";
export const metadata = {
  title: "Shipping Policy | RadhaRanihandicraft",
  description: "Our shipping methods, timeframes, and procedures for premium spiritual artifacts",
  openGraph: {
    title: "Shipping Policy |  RadhaRanihandicraft",
    description: "Our shipping methods, timeframes, and procedures for premium spiritual artifacts",
    images: [
      {
        url: "/about-marble.png",
        width: 800,
        height: 600,
        alt: "RadhaRaniHandicraft Marble Statue",
      },
    ],
  },
}
export default function ShippingPolicy() {
  return (
    <>
      <Head>
        <title>Shipping Policy | RadhaRanihandicraft</title>
        <meta name="description" content="Our shipping methods, timeframes, and procedures for premium spiritual artifacts" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Shipping Policy</h1>
        <p className="mb-4">Last Updated: April 25, 2025</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Order Processing</h2>
        <p className="mb-4">All orders are received and processed through our official WhatsApp business account. After your order is confirmed and payment is received, we typically process orders within 1-3 business days before shipping.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Premium Shipping & Handling</h2>
        <p className="mb-4">Due to the high-value and delicate nature of our spiritual artifacts, we do not offer free shipping. Each piece is carefully packaged with premium materials to ensure safe transit and preserve the integrity of these sacred items. Our shipping costs reflect the specialized handling required for these unique artifacts.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Methods</h2>
        <p className="mb-4">We ship all products using premium, insured courier services. The specific shipping carrier will be communicated to you during the ordering process via WhatsApp. For high-value items, we may require signature confirmation upon delivery.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Timeframes</h2>
        <ul className="list-disc pl-8 mb-4">
          <li>Domestic shipping: 3-7 business days</li>
          <li>International shipping: 7-21 business days</li>
        </ul>
        <p className="mb-4">Please note that these timeframes are estimates and not guarantees. Each piece is carefully prepared for shipment, which may require additional handling time for particularly delicate or large artifacts.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Costs</h2>
        <p className="mb-4">Shipping costs are calculated based on:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Delivery location</li>
          <li>Package weight and dimensions</li>
          <li>Value of the artifact (for insurance purposes)</li>
          <li>Special handling requirements</li>
        </ul>
        <p className="mb-4">The exact shipping cost will be provided to you via WhatsApp during the ordering process before payment is finalized. For high-value items, we strongly recommend selecting fully insured shipping options.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Order Tracking</h2>
        <p className="mb-4">Once your order has been shipped, we will provide you with a tracking number via WhatsApp. You can use this number to track your package through the courier's website or app.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Insurance</h2>
        <p className="mb-4">Given the value of our artifacts, we offer shipping insurance on all orders. For items exceeding certain value thresholds, insurance is mandatory. The cost of insurance is included in the shipping fee provided during checkout.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Restrictions</h2>
        <p className="mb-4">We currently ship to most countries worldwide. However, there may be certain regions where we cannot ship due to logistical constraints or local regulations. If we are unable to ship to your location, we will inform you during the ordering process.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Package Handling</h2>
        <p className="mb-4">Our spiritual artifacts are valuable and delicate items that require specialized handling. Each product is carefully packaged with custom protective materials to ensure safe transit. We use premium packaging materials that protect against vibration, moisture, and impact.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Delivery Issues</h2>
        <p className="mb-4">In case of any delivery issues, such as damaged packages, incorrect items, or missing deliveries, please contact us immediately via WhatsApp with photos of the package (if applicable) and a description of the issue. Claims regarding damaged items must be filed within 24 hours of receiving the package.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Address Accuracy</h2>
        <p className="mb-4">Customers are responsible for providing accurate shipping addresses. We are not responsible for packages delivered to incorrect addresses due to customer error. Please carefully review your shipping information before confirming your order.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Customs & Import Duties</h2>
        <p className="mb-4">For international shipments, customers are responsible for any customs fees, import duties, or taxes imposed by their country. These fees are not included in our shipping costs and will be charged separately by your local customs authority.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to Shipping Policy</h2>
        <p className="mb-4">We reserve the right to modify this Shipping Policy at any time. Changes will be effective immediately upon posting to the website.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Information</h2>
        <p className="mb-4">For any questions regarding our shipping policies or to inquire about the status of your order, please contact us through our WhatsApp number listed on the website.</p>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    </>
  );
}