"use client"
// components/categories/CategoryGrid.tsx
import { Grid3x3 } from 'lucide-react';
import CategoryCard from './CategoryCard';
import { Category } from '@/app/categories/page';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-amber-200 shadow-xl max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full mb-6">
          <Grid3x3 className="w-12 h-12 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          No categories available yet
        </h2>
        <p className="text-gray-600 text-lg">Check back soon for our handcrafted collections</p>
      </div>
    );
  }

  return (
    <section 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 animate-fade-in-up" 
      style={{ animationDelay: '0.2s' }}
      aria-label="Product categories"
    >
      {categories.map((category, index) => (
        <CategoryCard key={category.slug.current} category={category} index={index} />
      ))}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
