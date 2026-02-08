// components/ProductCard.tsx
"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity.cli";

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);

const ProductCard = memo(({ product }) => {
  const dimensions = product?.dimensions;
  const actualPrice = product?.actual_price 
    ? parseFloat(product.actual_price) 
    : null;
  const sellingPrice = parseFloat(product.price);
  const discountPercentage = actualPrice
    ? Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)
    : 0;

  return (
    <article 
      className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-amber-100 hover:border-amber-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
      itemScope 
      itemType="https://schema.org/Product"
    >
      {/* Product Image */}
      <Link href={`/product/${product.slug.current}`} aria-label={`View ${product.name}`}>
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
          {product.images && product.images.length > 0 ? (
            <Image
              src={urlFor(product.images[0]).url()}
              alt={product.name}
              fill
              className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              itemProp="image"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-3 sm:left-3 sm:right-3 flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-2">
            {discountPercentage > 0 && (
              <span className="inline-flex items-center px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg">
                {discountPercentage}% OFF
              </span>
            )}
            {product.featured && (
              <span className="inline-flex items-center px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg">
                ⭐
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-2.5 sm:p-4 lg:p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/product/${product.slug.current}`}>
            <h3 
              className="text-xs sm:text-base lg:text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-yellow-700 transition-colors leading-tight"
              itemProp="name"
            >
              {product.name}
            </h3>
          </Link>

          <Link href={`/category/${product.category?.slug.current}`}>
            <p className="text-[10px] sm:text-xs lg:text-sm text-amber-700 font-medium mb-1.5 sm:mb-2 hover:text-amber-800 transition-colors">
              {product.category?.title}
            </p>
          </Link>

          {/* Dimensions */}
          {dimensions && (
            <div className="hidden sm:block text-xs text-gray-600 mb-3 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 inline-block">
              <span className="font-medium text-gray-700">
                {[
                  dimensions.height?.value &&
                    `H: ${dimensions.height.value}${dimensions.height?.unit?.symbol || '"'}`,
                  dimensions.width?.value &&
                    `W: ${dimensions.width.value}${dimensions.width?.unit?.symbol || '"'}`,
                  dimensions.length?.value &&
                    `L: ${dimensions.length.value}${dimensions.length?.unit?.symbol || '"'}`,
                ]
                  .filter(Boolean)
                  .join(" × ")}
              </span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="mt-2 sm:mt-4 space-y-1.5 sm:space-y-3">
          <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="INR" />
            <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900" itemProp="price" content={sellingPrice}>
              ₹{sellingPrice.toLocaleString("en-IN")}
            </p>
            {actualPrice && actualPrice > sellingPrice && (
              <p className="text-[10px] sm:text-sm text-gray-500 line-through">
                ₹{actualPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300">
              {product.paintingStyle}
            </span>
            {product.material && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-300">
                {product.material.title}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Link href={`/product/${product.slug.current}`}>
            <button className="w-full cursor-pointer py-1.5 sm:py-2.5 px-2 sm:px-4 text-[10px] sm:text-sm font-semibold rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return prevProps.product._id === nextProps.product._id;
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
