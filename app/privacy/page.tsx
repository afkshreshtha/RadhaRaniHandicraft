// pages/privacy-policy.tsx
import Head from "next/head";
import Link from "next/link";
export const metadata = {
  title: "Privacy Policy | RadhaRanihandicraft",
  description: "Our privacy policy and data practices",
  openGraph: {
    title: "Privacy Policy | RadhaRanihandicraft",
    description: "Our privacy policy and data practices",
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
export default function PrivacyPolicy() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">Last Updated: April 25, 2025</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Introduction</h2>
        <p className="mb-4">
          Welcome to our handcrafted RadhaRanihandicraft store. We respect your privacy and are committed to protecting any information shared with us. This Privacy Policy explains our practices regarding data collection and use.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Do Not Collect</h2>
        <p className="mb-2">We are committed to minimal data collection. We do not:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Store personal customer information in a database</li>
          <li>Collect or maintain credit card information</li>
          <li>Use cookies or tracking technologies to monitor behavior</li>
          <li>Share or sell any customer information with third parties</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Limited Information Collection</h2>
        <p className="mb-2">The only information we temporarily process is:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Contact information (name, phone number) provided when placing orders via WhatsApp</li>
          <li>Shipping address for order delivery</li>
          <li>Order details (items purchased, quantity, price)</li>
        </ul>
        <p className="mb-4">This information is used solely for processing and fulfilling your order and is not stored in any permanent database.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">WhatsApp Communication</h2>
        <p className="mb-2">Our primary method of order processing is through WhatsApp. Please be aware that:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Communications occur through the WhatsApp platform, which has its own privacy policy</li>
          <li>Order details and communications are kept only as long as necessary to complete your transaction</li>
          <li>We do not use WhatsApp conversations for marketing purposes without consent</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
        <p className="mb-2">We use select third-party services to operate our business:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Payment processors (who have their own privacy policies)</li>
          <li>Shipping carriers (who require delivery information)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
        <p className="mb-2">You have the right to:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Request information about what limited data we have regarding your order</li>
          <li>Request deletion of any conversation history after your order is complete</li>
          <li>Opt out of any future communications</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Children's Privacy</h2>
        <p className="mb-4">Our products and services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
        <p className="mb-4">We may update this Privacy Policy occasionally. The latest version will always be posted on our website with the effective date.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p className="mb-4">If you have any questions about this Privacy Policy, please contact us via the WhatsApp number provided on our website.</p>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    </>
  );
}