"use client"
import { Sparkles, Package } from 'lucide-react';

export default function CategoryPageHeader() {
  return (
    <header className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto animate-fade-in-up">
      {/* Premium Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100 border-2 border-yellow-300/60 rounded-full mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
        <Package className="w-4 h-4 text-amber-600 animate-pulse" />
        <span className="text-sm font-bold text-amber-900 uppercase tracking-wider">
          Explore Collections
        </span>
        <Sparkles className="w-4 h-4 text-yellow-600 animate-bounce" style={{ animationDuration: '2s' }} />
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight mb-6">
        <span className="block bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Discover Our
        </span>
        <span className="block bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-600 bg-clip-text text-transparent mt-2">
          Sacred Collections
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
        Explore our carefully curated categories of{' '}
        <span className="font-bold text-amber-800 relative inline-block">
          handcrafted marble deities
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-30" />
        </span>
        {' '}to find exactly what your sacred space needs
      </p>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-yellow-500 to-amber-500 rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
        <div className="h-1 w-20 bg-gradient-to-l from-transparent via-amber-500 to-yellow-500 rounded-full" />
      </div>

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
    </header>
  );
}
