"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FaWhatsapp, FaArrowLeft, FaExpand, FaShare } from "react-icons/fa";
import { MdOutlineLocalShipping, MdVerified } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoShieldCheckmark, IoHeartOutline, IoHeart } from "react-icons/io5";
import { BiRuler } from "react-icons/bi";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Head from "next/head";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/sanity.cli";

// Fetch related products
const fetchRelatedProducts = async (
  categoryId: string,
  currentProductId: string
) => {
  return await client.fetch(
    `*[_type == "product" && category._ref == $categoryId && _id != $currentProductId][0...4] {
      _id,
      name,
      slug,
      price,
      actual_price,
      "mainImage": images[0].asset->url,
      category->{title, slug}
    }`,
    { categoryId, currentProductId }
  );
};

// Fetch product views/stats (optional - if you track analytics)
const fetchProductStats = async (productId: string) => {
  // This would connect to your analytics/stats endpoint
  return {
    views: 0,
    favorites: 0,
  };
};

export const ProductDetail = ({ product }) => {
  const displayProduct = product;
  const productImages = useMemo(
    () =>
      displayProduct?.images ||
      (displayProduct?.image ? [displayProduct?.image] : []),
    [displayProduct]
  );

  // TanStack Query - Fetch related products
  const { data: relatedProducts = [], isLoading: relatedLoading } = useQuery({
    queryKey: [
      "relatedProducts",
      displayProduct?.category?._ref,
      displayProduct?._id,
    ],
    queryFn: () =>
      fetchRelatedProducts(
        displayProduct?.category?._ref || displayProduct?.category?._id,
        displayProduct?._id
      ),
    enabled: !!displayProduct?.category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // TanStack Query - Fetch product stats (optional)
  const { data: productStats } = useQuery({
    queryKey: ["productStats", displayProduct?._id],
    queryFn: () => fetchProductStats(displayProduct?._id),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Format price in Indian currency format
  const formatIndianCurrency = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const getImageUrl = (image) => {
    if (typeof image === "string" && image.startsWith("/")) {
      return image;
    }
    return urlFor(image).url();
  };

  // Prepare slides for lightbox
  const slides = useMemo(
    () =>
      productImages.map((img) => ({
        src: getImageUrl(img),
        width: 1200,
        height: 1200,
      })),
    [productImages]
  );

  const handleWhatsAppContact = () => {
    const productImageUrl =
      productImages.length > 0 ? getImageUrl(productImages[0]) : null;

    const message = `Hi, I'm interested in purchasing:

*${displayProduct?.name}*
${productImageUrl ? `🖼 Product Image: ${productImageUrl}\n` : ""}
💰 Price: ${formatIndianCurrency(displayProduct?.price)}${
      displayProduct?.actual_price
        ? ` (${Math.round(
            ((displayProduct?.actual_price - displayProduct?.price) /
              displayProduct?.actual_price) *
              100
          )}% off)`
        : ""
    }
📦 Quantity: ${quantity}
${
  displayProduct?.dimensions
    ? `📐 Dimensions: ${displayProduct?.dimensions.height?.value}${displayProduct?.dimensions.height?.unit?.symbol || ""} × ${displayProduct?.dimensions.width?.value}${displayProduct?.dimensions.width?.unit?.symbol || ""} × ${displayProduct?.dimensions.length?.value}${displayProduct?.dimensions.length?.unit?.symbol || ""}\n`
    : ""
}
🪵 Material: ${displayProduct?.material?.title || ""}

Could you provide more details?`;

    const whatsappUrl = `https://wa.me/8273366089?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayProduct?.name,
          text: `Check out ${displayProduct?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  const discount = displayProduct?.actual_price
    ? Math.round(
        ((displayProduct?.actual_price - displayProduct?.price) /
          displayProduct?.actual_price) *
          100
      )
    : 0;

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayProduct?.name,
    image: productImages.map((img) => getImageUrl(img)),
    description: displayProduct?.description,
    sku: displayProduct?._id,
    brand: {
      "@type": "Brand",
      name: "Radharani Handicrafts",
    },
    offers: {
      "@type": "Offer",
      url: `https://yourdomain.com/product/${displayProduct?.slug}`,
      priceCurrency: "INR",
      price: displayProduct?.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: displayProduct?.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <Head>
        <title>{displayProduct?.name} | Radharani Handicrafts</title>
        <meta name="description" content={displayProduct?.description} />
        <meta property="og:title" content={displayProduct?.name} />
        <meta property="og:description" content={displayProduct?.description} />
        <meta
          property="og:image"
          content={productImages[0] ? getImageUrl(productImages[0]) : ""}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData),
          }}
        />
      </Head>

      <div className="relative bg-gradient-to-br from-gray-50 via-white to-amber-50/30 min-h-screen overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl relative z-10">
          {/* Enhanced Breadcrumb Navigation */}
          <nav
            className="flex items-center justify-between gap-2 mb-4 sm:mb-6 lg:mb-8 py-2 sm:py-3 animate-fade-in-up"
            aria-label="Breadcrumb"
          >
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              {/* Back Button */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 
                 bg-white/90 backdrop-blur-sm rounded-xl 
                 text-gray-700 hover:text-amber-600 hover:bg-amber-50/90
                 border-2 border-gray-200 hover:border-amber-300
                 transition-all duration-300 ease-out
                 shadow-sm hover:shadow-md
                 text-xs sm:text-sm font-medium
                 whitespace-nowrap transform hover:-translate-x-1"
                aria-label="Back to home"
              >
                <FaArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Back</span>
              </Link>

              {/* Breadcrumb Trail */}
              <ol className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 min-w-0">
                <li className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href="/products"
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5
                     text-xs sm:text-sm font-medium
                     text-gray-600 hover:text-amber-600
                     hover:bg-amber-50/50 rounded-lg
                     transition-all duration-200
                     border border-transparent hover:border-amber-200"
                  >
                    Products
                  </Link>
                  <span className="text-gray-300 text-xs" aria-hidden="true">
                    /
                  </span>
                </li>

                <li className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                  <Link
                    href={`/category/${
                      displayProduct?.category?.slug?.current ||
                      displayProduct?.category?.slug ||
                      ""
                    }`}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5
                     text-xs sm:text-sm font-medium
                     text-gray-600 hover:text-amber-600
                     hover:bg-amber-50/50 rounded-lg
                     transition-all duration-200
                     border border-transparent hover:border-amber-200 max-w-[120px] sm:max-w-none truncate"
                  >
                    {displayProduct?.category?.title || "Category"}
                  </Link>
                </li>
              </ol>
            </div>

            {/* Share & Favorite Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">

              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-xl 
                   border-2 border-gray-200 hover:border-amber-300
                   transition-all duration-300 shadow-sm hover:shadow-md
                   transform hover:scale-110"
                  aria-label="Share product"
                >
                  <FaShare className="w-4 h-4 text-gray-600 hover:text-amber-600" />
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-amber-200 p-2 z-50 animate-fade-in">
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 text-sm hover:bg-amber-50 rounded-lg whitespace-nowrap"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Main Product Card */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 animate-fade-in-up animation-delay-200">
            {/* Product Gallery Section */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8">
              <div className="lg:sticky lg:top-4">
                {/* Main Image with Enhanced Interactions */}
                <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-2xl overflow-hidden mb-4 shadow-xl group">
                  {productImages.length > 0 && (
                    <div
                      className="relative w-full h-full cursor-zoom-in"
                      onClick={() => setIsOpen(true)}
                    >
                      <Image
                        src={getImageUrl(productImages[selectedImage])}
                        alt={displayProduct?.name}
                        fill
                        className={`object-contain p-4 sm:p-6 transition-all duration-700 group-hover:scale-110 ${
                          imageLoading ? "opacity-0" : "opacity-100"
                        }`}
                        priority={selectedImage === 0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        onLoad={() => setImageLoading(false)}
                      />
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-amber-50">
                          <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-spin border-t-amber-600"></div>
                            <div className="absolute inset-2 rounded-full border-4 border-yellow-200 animate-spin border-b-yellow-600 animation-delay-150"></div>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Zoom Icon */}
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl transform group-hover:scale-110">
                        <FaExpand className="text-base sm:text-lg" />
                      </div>

                      {/* Floating Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  {/* Enhanced Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-br from-red-600 via-red-500 to-pink-600 text-white text-sm sm:text-base font-black px-4 py-2 rounded-xl shadow-2xl animate-bounce-slow flex items-center gap-2">
                      <span>{discount}% OFF</span>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {displayProduct?.featured && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </div>
                  )}
                </div>

                {/* Enhanced Thumbnail Gallery */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 animate-fade-in-up animation-delay-300">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          setImageLoading(true);
                        }}
                        className={`relative aspect-square w-full rounded-xl overflow-hidden transition-all duration-300 transform ${
                          selectedImage === index
                            ? "ring-4 ring-amber-500 ring-offset-2 scale-95 shadow-xl"
                            : "ring-2 ring-gray-200 opacity-60 hover:opacity-100 hover:ring-amber-300 hover:scale-105 shadow-md hover:shadow-lg"
                        }`}
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`${displayProduct?.name} - View ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw"
                        />
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Product Details - Same as before */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 animate-fade-in-up animation-delay-400">
              {/* Product Title Section */}
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {displayProduct?.name}
                </h1>

                {/* Category & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {displayProduct?.category && (
                    <Link
                      href={`/category/${displayProduct?.category.slug.current}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-700 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <span>{displayProduct?.category.title}</span>
                    </Link>
                  )}
                  {displayProduct?.paintingStyle && (
                    <span className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border-2 border-blue-200">
                      {displayProduct?.paintingStyle}
                    </span>
                  )}
                </div>
              </div>

              {/* Ultra-Enhanced Price Section */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-200/80 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/60 p-6 sm:p-8 mb-6 shadow-2xl shadow-amber-100/50 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl hover:shadow-amber-200/50 animate-fade-in-up animation-delay-500">
                {/* Animated Background Elements */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/30 blur-3xl animate-pulse" />
                <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-200/30 to-amber-200/30 blur-3xl animate-pulse animation-delay-1000" />

                <div className="relative">
                  {/* Price Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-sm font-bold uppercase tracking-widest text-transparent">
                      Starting from
                    </span>
                  </div>

                  {/* Main Price */}
                  <div className="mb-4 flex flex-wrap items-end gap-3">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900">
                      {formatIndianCurrency(displayProduct?.price)}
                    </span>

                    {/* Original Price & Discount */}
                    {displayProduct?.actual_price && (
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="text-lg sm:text-xl font-semibold text-gray-400 line-through">
                          {formatIndianCurrency(displayProduct?.actual_price)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 px-3 py-1.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-green-200/50 animate-pulse">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Save {discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Decorative Divider */}
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-300 to-transparent" />
                  </div>

                  {/* Price Note */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200/50">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Price shown is for the displayed size.{" "}
                      <span className="font-bold text-gray-900">
                        Final pricing varies by size, finish & delivery
                        location.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Quantity Selector */}
              <div className="mb-6 animate-fade-in-up animation-delay-600">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Quantity
                </label>
                <div className="flex items-center border-2 border-amber-200 rounded-2xl w-fit overflow-hidden bg-gradient-to-r from-white to-amber-50/30 shadow-lg hover:shadow-xl transition-shadow">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className={`px-5 sm:px-6 py-3 sm:py-4 text-gray-700 hover:bg-amber-100 active:bg-amber-200 transition-all ${
                      quantity <= 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:text-amber-700 transform hover:scale-110"
                    }`}
                    disabled={quantity <= 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="px-6 sm:px-8 py-3 sm:py-4 border-x-2 border-amber-200 font-black text-lg sm:text-xl min-w-[70px] sm:min-w-[80px] text-center bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className={`px-5 sm:px-6 py-3 sm:py-4 text-gray-700 hover:bg-amber-100 active:bg-amber-200 transition-all ${
                      quantity >= 10
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:text-amber-700 transform hover:scale-110"
                    }`}
                    disabled={quantity >= 10}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Enhanced Specifications Grid */}
              <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in-up animation-delay-700">
                {displayProduct?.material && (
                  <div className="group bg-gradient-to-br from-amber-50 to-yellow-50 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <p className="text-xs text-amber-700 uppercase tracking-wider font-black">
                        Material
                      </p>
                    </div>
                    <p className="font-black text-base sm:text-lg text-gray-900">
                      {typeof displayProduct?.material === "object"
                        ? displayProduct?.material.title
                        : displayProduct?.material}
                    </p>
                  </div>
                )}

                {displayProduct?.dimensions && (
                  <div className="group col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BiRuler className="w-5 h-5 text-blue-600" />
                      <p className="text-xs text-blue-700 uppercase tracking-wider font-black">
                        Dimensions
                      </p>
                    </div>
                    <p className="font-black text-base sm:text-lg text-gray-900">
                      {displayProduct?.dimensions.height?.value}
                      {displayProduct?.dimensions.height?.unit?.symbol ||
                        '"'} × {displayProduct?.dimensions.width?.value}
                      {displayProduct?.dimensions.width?.unit?.symbol ||
                        '"'} × {displayProduct?.dimensions.length?.value}
                      {displayProduct?.dimensions.length?.unit?.symbol || '"'}
                    </p>
                  </div>
                )}

                {displayProduct?.artist && (
                  <div className="group col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1">
                    <p className="text-xs text-purple-700 uppercase tracking-wider font-black mb-2">
                      Crafted By
                    </p>
                    <p className="font-black text-base sm:text-lg text-gray-900 mb-1">
                      {displayProduct?.artist.name}
                    </p>
                    {displayProduct?.artist.bio && (
                      <p className="text-xs sm:text-sm text-gray-600 leading-snug">
                        {displayProduct?.artist.bio}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {displayProduct?.description && (
                <div className="mb-8 animate-fade-in-up animation-delay-800">
                  <h2 className="text-lg sm:text-xl font-black mb-3 text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full"></span>
                    Description
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gradient-to-br from-gray-50 to-amber-50/30 p-5 rounded-2xl border-2 border-gray-200">
                    {displayProduct?.description}
                  </p>
                </div>
              )}

              {/* WhatsApp CTA Button */}
              <div className="mb-6 animate-fade-in-up animation-delay-900">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white font-black text-base sm:text-lg py-4 sm:py-5 px-6 rounded-2xl transition-all duration-300 gap-3 shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <FaWhatsapp className="text-2xl sm:text-3xl relative z-10 animate-pulse" />
                  <span className="relative z-10">Enquire on WhatsApp</span>
                </button>
              </div>

              {/* Enhanced Trust Badges */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in-up animation-delay-1000">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg flex-shrink-0 transform group-hover:rotate-12 transition-transform">
                    <MdOutlineLocalShipping className="text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-gray-900 text-sm">
                      Fast Delivery
                    </p>
                    <p className="text-xs text-gray-600">Insured shipping</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-xl shadow-lg flex-shrink-0 transform group-hover:rotate-12 transition-transform">
                    <RiSecurePaymentLine className="text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-gray-900 text-sm">
                      Secure Pay
                    </p>
                    <p className="text-xs text-gray-600">100% protected</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-3 rounded-xl shadow-lg flex-shrink-0 transform group-hover:rotate-12 transition-transform">
                    <MdVerified className="text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-gray-900 text-sm">
                      Authentic
                    </p>
                    <p className="text-xs text-gray-600">100% genuine</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl shadow-lg flex-shrink-0 transform group-hover:rotate-12 transition-transform">
                    <IoShieldCheckmark className="text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-gray-900 text-sm">Warranty</p>
                    <p className="text-xs text-gray-600">Quality assured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section with TanStack Query */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 sm:mt-16 animate-fade-in-up animation-delay-1200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full"></span>
                  You May Also Like
                </h2>
                <Link
                  href={`/category/${displayProduct?.category?.slug?.current}`}
                  className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <Link
                    key={relatedProduct._id}
                    href={`/product/${relatedProduct.slug?.current || relatedProduct.slug}`}
                    className="group animate-fade-in-up"
                    style={{ animationDelay: `${1200 + index * 100}ms` }}
                  >
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-500 border-2 border-gray-100 hover:border-amber-300 transform hover:-translate-y-2">
                      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-amber-50/20">
                        {relatedProduct.mainImage && (
                          <Image
                            src={relatedProduct.mainImage}
                            alt={relatedProduct.name}
                            fill
                            className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        )}
                        {relatedProduct.actual_price &&
                          relatedProduct.actual_price >
                            relatedProduct.price && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                              {Math.round(
                                ((relatedProduct.actual_price -
                                  relatedProduct.price) /
                                  relatedProduct.actual_price) *
                                  100
                              )}
                              % OFF
                            </div>
                          )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg sm:text-xl font-black text-gray-900">
                          {formatIndianCurrency(relatedProduct.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Lightbox */}
      {typeof window !== "undefined" && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={slides}
          index={selectedImage}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 4,
            scrollToZoom: true,
          }}
          animation={{ fade: 400 }}
          carousel={{
            finite: productImages.length <= 1,
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, .97)" },
          }}
        />
      )}
    </>
  );
};
