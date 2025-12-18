"use client";

import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity.cli";
import imageUrlBuilder from "@sanity/image-url";
import { useEffect, useState } from "react";
import { Star, Sparkles, ArrowRight, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Product {
  _id: string;
  name: string;
  price: string;
  actual_price?: string;
  images: any[];
  paintingStyle: string;
  category?: {
    title: string;
    slug: { current: string };
  };
  featured?: boolean;
  dimensions?: {
    height?: { value: number; unit?: { symbol: string } };
    width?: { value: number; unit?: { symbol: string } };
    length?: { value: number; unit?: { symbol: string } };
  };
  slug: { current: string };
}

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

// Calculate discount percentage
const calculateDiscount = (actualPrice: string, sellingPrice: string): number => {
  const actual = parseFloat(actualPrice);
  const selling = parseFloat(sellingPrice);
  if (!actual || !selling || actual <= selling) return 0;
  return Math.round(((actual - selling) / actual) * 100);
};

// Format price in Indian currency
const formatPrice = (price: string): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(parseFloat(price));
};

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const query = `*[_type == "product" && featured == true] {
    _id,
    name,
    price,
    actual_price,
    paintingStyle,
    images,
    category->{
      title,
      slug
    },
    featured,
    dimensions {
      length {
        value,
        unit->{title, symbol}
      },
      width {
        value,
        unit->{title, symbol}
      },
      height {
        value,
        unit->{title, symbol}
      }
    },
    slug,
  }[0...8]`;

  return await client.fetch(query);
};
export default function FeaturedProducts() {

  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });


  if (isLoading) {
    return (
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mb-6 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 animate-pulse">
            Loading Featured Collection...
          </h2>
          <p className="mt-3 text-gray-600 animate-pulse">
            Curating our finest artisan pieces for you
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" />
      
      {/* Floating decoration elements */}
      <div className="absolute top-20 right-20 w-20 h-20 border-4 border-yellow-300/30 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-40 left-10 w-16 h-16 border-4 border-amber-300/30 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300 rounded-full mb-6 shadow-md">
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-bold tracking-wider text-yellow-900 uppercase">
              Handcrafted Excellence
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>

          {/* Main Heading with Gradient */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-5">
            <span className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Featured Artisan
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Creations
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Meticulously crafted spiritual artifacts, blessed with devotion and
            perfected through generations of artisan mastery
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-yellow-500 to-amber-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <div className="h-1 w-16 bg-gradient-to-l from-transparent via-amber-500 to-yellow-500 rounded-full" />
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-amber-200 shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full mb-4">
              <Tag className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No featured products available
            </h3>
            <p className="text-gray-600">Check back soon for our handpicked selections</p>
          </div>
        ) : (
          <>
            {/* Products Grid - Optimized for all screen sizes */}
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 mb-12 sm:mb-16">
              {featuredProducts.map((product, index) => {
                const discount = product.actual_price
                  ? calculateDiscount(product.actual_price, product.price)
                  : 0;

                return (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-amber-100 hover:border-amber-300 transform hover:-translate-y-2"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Image Container */}
                    <Link href={`/product/${product.slug.current}`}>
                      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
                        {product.images?.length > 0 ? (
                          <Image
                            src={urlFor(product.images[0]).url()}
                            alt={product.name}
                            fill
                            className="object-contain p-4 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                            sizes="(max-width: 475px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}

                        {/* Badges Container */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-20">
                          {/* Category Badge */}
                          {product.category && (
                            <Link
                              href={`/category/${product.category.slug.current}`}
                              className="group/badge"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-amber-200 hover:border-amber-400 transition-all transform hover:scale-105">
                                <span className="text-xs font-bold text-gray-800 group-hover/badge:text-amber-700 transition-colors">
                                  {product.category.title}
                                </span>
                              </div>
                            </Link>
                          )}

                          {/* Discount Badge */}
                          {discount > 0 && (
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
                              <span className="text-xs font-extrabold">
                                {discount}% OFF
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Featured Star Badge */}
                        <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-full shadow-lg z-10 animate-bounce" style={{ animationDuration: '2s' }}>
                          <Star className="w-4 h-4 text-white fill-white" />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                          <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="text-sm font-bold text-amber-700 flex items-center gap-2">
                              Quick View
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="p-4 sm:p-5">
                      <div className="mb-3">
                        <Link href={`/product/${product.slug.current}`}>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-2 line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Dimensions */}
                        {product.dimensions && (
                          <div className="inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 mb-2">
                            <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-700">
                              {[
                                product?.dimensions?.height?.value &&
                                  `H:${product?.dimensions.height.value}${
                                    product.dimensions.height?.unit?.symbol || '"'
                                  }`,
                                product.dimensions?.width?.value &&
                                  `W:${product.dimensions?.width?.value}${
                                    product.dimensions.width?.unit?.symbol || '"'
                                  }`,
                                product.dimensions?.length?.value &&
                                  `L:${product.dimensions?.length?.value}${
                                    product.dimensions.length?.unit?.symbol || '"'
                                  }`,
                              ]
                                .filter(Boolean)
                                .join(" × ")}
                            </span>
                          </div>
                        )}

                        {/* Painting Style Tag */}
                        <div className="inline-flex items-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300">
                            {product.paintingStyle}
                          </span>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-amber-100">
                        <div>
                          <p className="text-xl sm:text-2xl font-extrabold text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                          {product.actual_price &&
                            parseFloat(product.actual_price) > parseFloat(product.price) && (
                              <p className="text-xs text-gray-500 line-through mt-0.5">
                                {formatPrice(product.actual_price)}
                              </p>
                            )}
                        </div>

                        <Link
                          href={`/product/${product.slug.current}`}
                          className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-110 group/btn"
                        >
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced CTA Section */}
            <div className="text-center">
              {/* Decorative element */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <div className="h-0.5 w-24 bg-gradient-to-l from-transparent via-amber-400 to-transparent" />
              </div>

              <Link
                href="/products"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 hover:from-yellow-700 hover:via-amber-700 hover:to-yellow-700 text-white text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Explore Complete Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>

              {/* Sub CTA text */}
              <p className="mt-4 text-sm text-gray-600">
                Discover over <span className="font-bold text-amber-700">100+ sacred artifacts</span> handcrafted with devotion
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
