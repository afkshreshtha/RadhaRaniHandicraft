"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaWhatsapp, FaArrowLeft, FaExpand } from "react-icons/fa";
import { MdOutlineLocalShipping, MdVerified } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoShieldCheckmark } from "react-icons/io5";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Head from "next/head";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const ProductDetail = ({ product }) => {
  const displayProduct = product;
  const productImages =
    displayProduct.images ||
    (displayProduct.image ? [displayProduct.image] : []);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Format price in Indian currency format with commas
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
  const slides = productImages.map((img) => ({
    src: getImageUrl(img),
    width: 1200,
    height: 1200,
  }));

  const handleWhatsAppContact = () => {
    const productImageUrl =
      productImages.length > 0 ? getImageUrl(productImages[0]) : null;

    const message = `Hi, I'm interested in purchasing:

*${displayProduct.name}*
${productImageUrl ? `🖼 Product Image: ${productImageUrl}\n` : ""}
💰 Price: ${formatIndianCurrency(displayProduct.price)}${
      displayProduct.actual_price
        ? ` (${Math.round(
            ((displayProduct.actual_price - displayProduct.price) /
              displayProduct.actual_price) *
              100
          )}% off)`
        : ""
    }
📦 Quantity: ${quantity}
${
  displayProduct.dimensions
    ? `📐 Dimensions: ${displayProduct.dimensions.height?.value}${displayProduct.dimensions.height?.unit?.symbol || ""} × ${displayProduct.dimensions.width?.value}${displayProduct.dimensions.width?.unit?.symbol || ""} × ${displayProduct.dimensions.length?.value}${displayProduct.dimensions.length?.unit?.symbol || ""}\n`
    : ""
}
🪵 Material: ${displayProduct.material?.title || ""}

Could you provide more details?`;

    const whatsappUrl = `https://wa.me/8273366089?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayProduct.name,
    image: productImages.map((img) => getImageUrl(img)),
    description: displayProduct.description,
    sku: displayProduct._id,
    brand: {
      "@type": "Brand",
      name: "Radharani Handicrafts",
    },
    offers: {
      "@type": "Offer",
      url: `https://yourdomain.com/product/${displayProduct.slug}`,
      priceCurrency: "INR",
      price: displayProduct.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: displayProduct.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData),
          }}
        />
      </Head>

      <div className="bg-gradient-to-br from-gray-50 via-white to-amber-50/30 min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
          {/* Breadcrumb Navigation - Enhanced Mobile */}
          <nav
            className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 lg:mb-8 py-2 sm:py-3"
            aria-label="Breadcrumb"
          >
            {/* Back Button - Mobile Optimized */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 
               bg-white/80 backdrop-blur-sm rounded-lg 
               text-gray-700 hover:text-amber-600 hover:bg-amber-50/80
               border border-gray-200 hover:border-amber-300
               transition-all duration-200 ease-in-out
               shadow-sm hover:shadow-md
               text-xs sm:text-sm font-medium
               whitespace-nowrap"
              aria-label="Back to home"
            >
              <FaArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Separator */}
            <span
              className="text-gray-300 mx-0.5 select-none"
              aria-hidden="true"
            >
              /
            </span>

            {/* Breadcrumb Trail */}
            <ol
              className="flex items-center gap-1 sm:gap-2 overflow-x-auto 
                  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                  pb-1 flex-1 min-w-0"
            >
              {/* Products Link */}
              <li className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <Link
                  href="/products"
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5
                   text-xs sm:text-sm font-medium
                   text-gray-600 hover:text-amber-600
                   hover:bg-amber-50/50 rounded-md
                   transition-all duration-200
                   border border-transparent hover:border-amber-200"
                >
                  Products
                </Link>
                <span
                  className="text-gray-300 text-xs sm:text-sm hidden sm:inline"
                  aria-hidden="true"
                >
                  /
                </span>
              </li>
              {/* Category Link */}
              <li className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <Link
                  href={`/category/${
                    displayProduct.category?.slug?.current ||
                    (displayProduct.category?.slug &&
                    typeof displayProduct.category.slug === "string"
                      ? displayProduct.category.slug
                      : "")
                  }`}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5
                   text-xs sm:text-sm font-medium
                   text-gray-600 hover:text-amber-600
                   hover:bg-amber-50/50 rounded-md
                   transition-all duration-200
                   border border-transparent hover:border-amber-200"
                >
                  {displayProduct.category?.title || "Products"}
                </Link>
                <span
                  className="text-gray-300 text-xs sm:text-sm"
                  aria-hidden="true"
                >
                  /
                </span>
              </li>

              {/* Current Product - Desktop Only */}
              <li className="hidden sm:flex items-center min-w-0">
                <span
                  className="px-3 py-1.5 text-sm font-semibold
                   text-amber-700 bg-amber-50/70
                   border border-amber-200 rounded-md
                   truncate max-w-[200px] md:max-w-xs"
                  aria-current="page"
                  title={displayProduct.name}
                >
                  {displayProduct.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* Main Product Card - Mobile Optimized */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Product Gallery Section - Mobile First */}
            <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-6">
              <div className="lg:sticky lg:top-4">
                {/* Main Image with Zoom */}
                <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-amber-50/20 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 shadow-md">
                  {productImages.length > 0 && (
                    <div
                      className="relative w-full h-full cursor-zoom-in group"
                      onClick={() => setIsOpen(true)}
                    >
                      <Image
                        src={getImageUrl(productImages[selectedImage])}
                        alt={displayProduct.name}
                        fill
                        className={`object-contain p-2 sm:p-4 transition-all duration-500 group-hover:scale-105 ${
                          imageLoading ? "opacity-0" : "opacity-100"
                        }`}
                        priority={selectedImage === 0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        onLoad={() => setImageLoading(false)}
                      />
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-600"></div>
                        </div>
                      )}

                      {/* Zoom Icon Overlay */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/70 backdrop-blur-sm text-white p-2 sm:p-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                        <FaExpand className="text-sm sm:text-base" />
                      </div>
                    </div>
                  )}

                  {/* Discount Badge - Enhanced */}
                  {displayProduct.actual_price && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg animate-pulse">
                      {Math.round(
                        ((displayProduct.actual_price - displayProduct.price) /
                          displayProduct.actual_price) *
                          100
                      )}
                      % OFF
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery - 2 Column Grid on Mobile */}
                {/* Thumbnail Gallery - Fixed Desktop Size */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          setImageLoading(true);
                        }}
                        className={`relative aspect-square w-full rounded-lg overflow-hidden transition-all duration-300 ${
                          selectedImage === index
                            ? "ring-2 ring-amber-500 ring-offset-2 scale-95 shadow-md"
                            : "ring-1 ring-gray-200 opacity-70 hover:opacity-100 hover:ring-amber-400 hover:scale-105 shadow-sm"
                        }`}
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`${displayProduct.name} - ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, (max-width: 1280px) 12vw, 10vw"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details - Mobile Optimized */}
            <div className="w-full lg:w-1/2 p-4 sm:p-5 lg:p-6">
              {/* Product Title */}
              <div className="mb-3 sm:mb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {displayProduct.name}
                </h1>

                {/* Category Badge */}
                {displayProduct.category && (
                  <Link
                    href={`/category/${displayProduct.category.slug.current}`}
                    className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-amber-200 transition-colors"
                  >
                    <span>{displayProduct.category.title}</span>
                  </Link>
                )}
              </div>

              {/* Rating Badge */}
              {displayProduct.rating && (
                <div className="flex items-center mb-4 sm:mb-5">
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full border border-blue-200">
                    <svg
                      className="w-4 h-4 text-yellow-400 mr-1 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">
                      {displayProduct.rating}
                    </span>
                    <span className="mx-1.5 text-gray-300">•</span>
                    <span className="text-xs text-gray-600">
                      {displayProduct.reviewCount} reviews
                    </span>
                  </div>
                </div>
              )}

              {/* Price Section - Enhanced Mobile */}
              <div className="mb-5 sm:mb-6 p-4 sm:p-5 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl border-2 border-amber-200 shadow-sm">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                    {formatIndianCurrency(displayProduct.price)}
                  </span>
                  {displayProduct.actual_price && (
                    <>
                      <span className="text-base sm:text-lg text-gray-500 line-through">
                        {formatIndianCurrency(displayProduct.actual_price)}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs sm:text-sm font-bold px-2 py-1 rounded-full border border-green-300">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Save{" "}
                        {Math.round(
                          ((displayProduct.actual_price -
                            displayProduct.price) /
                            displayProduct.actual_price) *
                            100
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
                {displayProduct.actual_price && (
                  <p className="text-xs sm:text-sm text-green-700 font-semibold">
                    You save{" "}
                    {formatIndianCurrency(
                      displayProduct.actual_price - displayProduct.price
                    )}
                  </p>
                )}
              </div>

              {/* Quantity Selector - Mobile Optimized */}
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className={`px-4 sm:px-5 py-2.5 sm:py-3 text-gray-700 hover:bg-amber-50 active:bg-amber-100 transition-colors ${
                      quantity <= 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:text-amber-600"
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
                  <span className="px-5 sm:px-6 py-2.5 sm:py-3 border-x-2 border-gray-200 font-bold text-base sm:text-lg min-w-[60px] sm:min-w-[70px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className={`px-4 sm:px-5 py-2.5 sm:py-3 text-gray-700 hover:bg-amber-50 active:bg-amber-100 transition-colors ${
                      quantity >= 10
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:text-amber-600"
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

              {/* Product Specifications - 2 Column Grid Mobile */}
              <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4">
                {displayProduct.paintingStyle && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Style
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-900 leading-tight">
                      {displayProduct.paintingStyle}
                    </p>
                  </div>
                )}

                {displayProduct.material && (
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-200 hover:border-amber-400 transition-colors">
                    <p className="text-[10px] sm:text-xs text-amber-700 uppercase tracking-wider font-semibold mb-1">
                      Material
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-900 leading-tight">
                      {typeof displayProduct.material === "object" &&
                      displayProduct.material?.title
                        ? displayProduct.material.title
                        : displayProduct.material}
                    </p>
                  </div>
                )}

                {displayProduct.dimensions && (
                  <div className="col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200 hover:border-blue-400 transition-colors">
                    <p className="text-[10px] sm:text-xs text-blue-700 uppercase tracking-wider font-semibold mb-1">
                      Dimensions
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-900">
                      {displayProduct.dimensions.height?.value}
                      {displayProduct.dimensions.height?.unit?.symbol ||
                        '"'} × {displayProduct.dimensions.width?.value}
                      {displayProduct.dimensions.width?.unit?.symbol ||
                        '"'} × {displayProduct.dimensions.length?.value}
                      {displayProduct.dimensions.length?.unit?.symbol || '"'}
                    </p>
                  </div>
                )}

                {displayProduct.artist && (
                  <div className="col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200 hover:border-purple-400 transition-colors">
                    <p className="text-[10px] sm:text-xs text-purple-700 uppercase tracking-wider font-semibold mb-1">
                      Artist
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-900">
                      {displayProduct.artist.name}
                    </p>
                    {displayProduct.artist.bio && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
                        {displayProduct.artist.bio}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Description - Mobile Optimized */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
                  Description
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {displayProduct.description}
                </p>
              </div>

              {/* Action Button - Full Width Mobile */}
              <div className="mb-5 sm:mb-6">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white font-bold text-base sm:text-lg py-3.5 sm:py-4 px-6 rounded-xl transition-all duration-300 gap-2.5 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                >
                  <FaWhatsapp className="text-xl sm:text-2xl" />
                  <span>Buy Now on WhatsApp</span>
                </button>
              </div>

              {/* Trust Badges - 2 Column Grid Mobile */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="bg-blue-600 p-2 sm:p-2.5 rounded-full shadow-md flex-shrink-0">
                    <MdOutlineLocalShipping className="text-lg sm:text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">
                      Fast Shipping
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                      Insured delivery
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                  <div className="bg-green-600 p-2 sm:p-2.5 rounded-full shadow-md flex-shrink-0">
                    <RiSecurePaymentLine className="text-lg sm:text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">
                      Secure Pay
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                      100% protected
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                  <div className="bg-amber-600 p-2 sm:p-2.5 rounded-full shadow-md flex-shrink-0">
                    <MdVerified className="text-lg sm:text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">
                      Authentic
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                      100% genuine
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="bg-purple-600 p-2 sm:p-2.5 rounded-full shadow-md flex-shrink-0">
                    <IoShieldCheckmark className="text-lg sm:text-xl text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">
                      Warranty
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                      Quality assured
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox with Zoom Plugin */}
      {typeof window !== "undefined" && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={slides}
          index={selectedImage}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
            scrollToZoom: true,
          }}
          animation={{ fade: 300 }}
          carousel={{
            finite: productImages.length <= 1,
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, .95)" },
          }}
        />
      )}
    </>
  );
};
