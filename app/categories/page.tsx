"use client";

import { client } from '@/sanity.cli';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, ArrowRight, Package, Grid3x3 } from 'lucide-react';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await client.fetch(`*[_type == "category"] {
          slug,
          title,
          description,
          "image": image.asset->url,
          "imageDimensions": image.asset->metadata.dimensions
        }`);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 py-12 sm:py-16 lg:py-20">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Loading Header */}
          <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mb-6 animate-pulse">
              <Grid3x3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              Discover Our Collections
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 animate-pulse">
              Loading sacred categories...
            </p>
          </div>

          {/* Loading Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-7">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-amber-100">
                <Skeleton className="w-full aspect-square" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-amber-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-amber-200/30 to-yellow-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 border-4 border-yellow-300/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-16 w-16 h-16 border-4 border-amber-300/20 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(251,191,36,0.1)_1px,_transparent_0)] bg-[length:40px_40px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300/50 rounded-full mb-6 shadow-md animate-fade-in">
            <Package className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-900 uppercase tracking-wide">
              Explore Collections
            </span>
            <Sparkles className="w-4 h-4 text-yellow-600" />
          </div>

          {/* Main Heading with Gradient */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-5">
            <span className="block bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in-up">
              Discover Our
            </span>
            <span className="block bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-600 bg-clip-text text-transparent mt-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Sacred Collections
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Explore our carefully curated categories of{' '}
            <span className="font-bold text-amber-800">handcrafted marble deities</span>
            {' '}to find exactly what your sacred space needs
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-yellow-500 to-amber-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <div className="h-1 w-16 bg-gradient-to-l from-transparent via-amber-500 to-yellow-500 rounded-full" />
          </div>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-amber-200 shadow-lg max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full mb-4">
              <Grid3x3 className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No categories available yet
            </h3>
            <p className="text-gray-600">Check back soon for our handcrafted collections</p>
          </div>
        ) : (
          <>
            {/* Enhanced Category Grid - Fully Responsive */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {categories.map((category, index) => {
                const aspectRatio = category.imageDimensions 
                  ? category.imageDimensions.aspectRatio 
                  : 1;
                
                return (
                  <Link 
                    href={`/category/${category.slug?.current || category.slug}`} 
                    key={category.slug?.current || category.slug}
                    className="group"
                    style={{
                      animationDelay: `${0.5 + index * 0.05}s`,
                    }}
                  >
                    <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-500 h-full flex flex-col border-2 border-amber-100 hover:border-amber-300 transform hover:-translate-y-2">
                      {/* Image Container with Gradient Overlay */}
                      <div className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50" style={{ paddingBottom: `${100 / aspectRatio}%` }}>
                        {category.image ? (
                          <Image 
                            src={category.image} 
                            alt={`${category.title} - Handcrafted Marble Collection`}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                            sizes="(max-width: 475px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300 mb-2" />
                            <span className="text-xs text-gray-400">No image</span>
                          </div>
                        )}

                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Category Count Badge (Optional - if you have product count) */}
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Explore
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-2 line-clamp-2 leading-snug">
                            {category.title}
                          </h2>
                          
                          {category.description && (
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {/* CTA Section */}
                        <div className="mt-auto pt-3 border-t-2 border-amber-100">
                          <div className="inline-flex items-center text-sm font-bold text-amber-700 group-hover:text-amber-800 transition-colors">
                            <span>View Collection</span>
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Accent Line */}
                      <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </article>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Info Section */}
            <div className="mt-12 sm:mt-16 text-center">
              {/* Decorative element */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <div className="h-0.5 w-24 bg-gradient-to-l from-transparent via-amber-400 to-transparent" />
              </div>

              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Can't find what you're looking for?{' '}
                <Link href="/products" className="font-bold text-amber-700 hover:text-amber-800 underline decoration-2 underline-offset-4 transition-colors">
                  Browse all products
                </Link>
                {' '}or{' '}
                <a 
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-green-600 hover:text-green-700 underline decoration-2 underline-offset-4 transition-colors"
                >
                  contact us on WhatsApp
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
