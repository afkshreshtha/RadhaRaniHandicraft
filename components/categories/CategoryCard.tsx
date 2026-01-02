"use client"
// components/categories/CategoryCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { Category } from '@/app/categories/page';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const slug = category.slug.current;

  return (
    <Link 
      href={`/category/${slug}`} 
      className="group animate-fade-in-scale"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 h-full flex flex-col border-2 border-amber-100 hover:border-amber-300 transform hover:-translate-y-2 hover:scale-[1.02]">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
          {category.image ? (
            <Image 
              src={category.image} 
              alt={`${category.title} - Handcrafted Marble Deity Collection`}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              loading={index < 6 ? 'eager' : 'lazy'}
              priority={index < 6}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-2" />
              <span className="text-xs text-gray-400 font-medium">No image</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Hover Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            Explore →
          </div>

          {/* Border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 transition-colors duration-300 rounded-2xl" />
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow min-h-[140px] sm:min-h-[160px]">
          <div className="flex-grow">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2 leading-snug mb-2">
              {category.title}
            </h2>
            
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="mt-auto pt-3 border-t-2 border-amber-100 group-hover:border-amber-300 transition-colors">
            <span className="inline-flex items-center text-sm font-bold text-amber-700 group-hover:text-amber-800 transition-colors">
              <span>View Collection</span>
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
            </span>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </article>

      <style jsx>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </Link>
  );
}
