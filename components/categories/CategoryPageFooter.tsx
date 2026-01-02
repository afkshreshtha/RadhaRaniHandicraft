"use client"
// components/categories/CategoryPageFooter.tsx
import Link from 'next/link';
import { Sparkles, ArrowRight, Phone } from 'lucide-react';

export default function CategoryPageFooter() {
  return (
    <footer className="mt-16 sm:mt-20 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      {/* Decorative Element */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        <div className="h-0.5 w-24 bg-gradient-to-l from-transparent via-amber-400 to-transparent" />
      </div>

      {/* Info Box */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-amber-100 p-6 max-w-3xl mx-auto shadow-lg">
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
          Can't find what you're looking for?{' '}
          <Link href="/products" className="font-bold text-amber-700 hover:text-amber-800 underline decoration-2 underline-offset-4 transition-colors inline-flex items-center gap-1">
            Browse all products
            <ArrowRight className="w-4 h-4" />
          </Link>
          {' '}or{' '}
          <a 
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-green-600 hover:text-green-700 underline decoration-2 underline-offset-4 transition-colors inline-flex items-center gap-1"
          >
            contact us on WhatsApp
            <Phone className="w-4 h-4" />
          </a>
        </p>
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
    </footer>
  );
}
