// pages/return-policy.tsx
import Head from "next/head";
import Link from "next/link";

export const metadata = {
  title: "Return & Refund Policy | RadhaRanihandicraft",
  description:
    "Return, refund, and replacement policy for handcrafted marble murtis and spiritual artifacts",
  openGraph: {
    title: "Return & Refund Policy | RadhaRanihandicraft",
    description:
      "Return, refund, and replacement policy for handcrafted marble murtis and spiritual artifacts",
    images: [
      {
        url: "/about-marble.png",
        width: 800,
        height: 600,
        alt: "RadhaRaniHandicraft Marble Statue",
      },
    ],
  },
};

export default function ReturnPolicy() {
  return (
    <>
      <Head>
        <title>Return & Refund Policy | RadhaRanihandicraft</title>
        <meta
          name="description"
          content="Return, refund, and replacement policy for handcrafted marble murtis and spiritual artifacts"
        />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Return & Refund Policy</h1>
        <p className="mb-4">Last Updated: April 25, 2025</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">No Return Policy</h2>
        <p className="mb-4">
          At <strong>Radha Rani Handicrafts</strong>, all products are handcrafted
          marble murtis and spiritual artifacts. Due to the delicate, sacred, and
          custom nature of our products, we follow a strict <strong>no return policy</strong>.
        </p>
        <p className="mb-4">
          Once an order is confirmed and dispatched, it cannot be returned under
          any circumstances.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          No Refund Policy
        </h2>
        <p className="mb-4">
          We do not offer refunds for any orders once payment is completed and the
          product is dispatched. This applies even in cases of damage during
          transit.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Pre-Dispatch Product & Packing Video
        </h2>
        <p className="mb-4">
          Before dispatch, we record a complete video showing:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>The final condition of the product</li>
          <li>Proper protective packaging</li>
          <li>Dispatch readiness</li>
        </ul>
        <p className="mb-4">
          This video is shared with the customer via WhatsApp for transparency.
          Once the video is shared and the order is dispatched, the order is
          considered final and accepted by the customer.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Damage During Transit
        </h2>
        <p className="mb-4">
          While we use premium packaging materials to ensure safe delivery,
          damage caused during shipping or transit is beyond our control.
        </p>
        <p className="mb-4">
          We do not provide returns, refunds, or replacements for items damaged
          during transit.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Replacement Policy
        </h2>
        <p className="mb-4">
          We do not offer replacements for any product once it has been
          dispatched, including cases of transit damage, courier delay, or
          mishandling.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Order Cancellation
        </h2>
        <p className="mb-4">
          Orders can only be canceled before the product enters the packing or
          dispatch stage. Once packing has started, cancellation is not possible.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Customer Responsibility
        </h2>
        <p className="mb-4">
          Customers are requested to review all product details, images,
          dimensions, and material information carefully before placing an order.
          By confirming the order, the customer agrees to this Return & Refund
          Policy.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Contact Information
        </h2>
        <p className="mb-4">
          If you have any questions regarding this policy, please contact us
          through our official WhatsApp number listed on the website before
          placing your order.
        </p>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
}
