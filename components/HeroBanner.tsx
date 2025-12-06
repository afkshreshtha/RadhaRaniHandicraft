"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Award, ChevronDown } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen lg:min-h-[90vh] bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-amber-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-amber-200/30 to-yellow-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 border-4 border-yellow-300/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-16 w-16 h-16 border-4 border-amber-300/20 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-20">
        {/* OPTIMIZED GRID - Content always visible on tablets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content Section - PRIORITY ON TABLETS */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300/50 rounded-full shadow-md animate-fade-in">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
              <span className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wide">
                Since 1985 • Master Craftsmen
              </span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
            </div>

            {/* TABLET-OPTIMIZED Headline - Shorter on tablets */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
              <span className="block bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in-up">
                Divine Artistry
              </span>
              <span className="hidden md:block text-gray-900 mt-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                in Pure
              </span>
              <span className="block bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-600 bg-clip-text text-transparent animate-fade-in-up md:mt-0 mt-2" style={{ animationDelay: '0.2s' }}>
                {/* Shorter for tablets */}
                <span className="md:hidden">Makrana Marble</span>
                <span className="hidden md:block">Makrana Marble</span>
              </span>
            </h1>

            {/* TABLET-OPTIMIZED Subheading - Shorter text */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Handcrafted by <span className="font-bold text-amber-800">Jaipur's master artisans</span>
              {/* Hide extended text on small tablets */}
              <span className="hidden sm:inline">, our marble deities embody centuries of sacred tradition</span>
              <span className="inline sm:hidden">with authentic marble</span>
            </p>

            {/* TABLET-OPTIMIZED Trust Indicators - Smaller on tablets */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold">100% Authentic</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span className="font-semibold">Award Winning</span>
              </div>
            </div>

            {/* TABLET-OPTIMIZED CTA Buttons - Smaller padding */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Link
                href="/products"
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 hover:from-yellow-700 hover:via-amber-700 hover:to-yellow-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>

              <Link
                href="/about"
                className="group border-2 border-amber-300 hover:border-amber-400 bg-white/80 backdrop-blur-sm hover:bg-amber-50 text-amber-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:shadow-lg text-center flex items-center justify-center gap-2"
              >
                <span className="hidden sm:inline">Our Heritage</span>
                <span className="sm:hidden">Learn More</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>

            {/* TABLET-OPTIMIZED Stats - Hide on small tablets in portrait */}
            <div className="hidden sm:grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t-2 border-amber-200/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                  38+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Years</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                  150+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Designs</div>
              </div>
            </div>
          </div>

          {/* Right Image Section - CONTROLLED HEIGHT ON TABLETS */}
          <div className="relative order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />
              
              {/* TABLET-OPTIMIZED Image container - Controlled aspect ratio */}
              <div className="relative w-full 
                aspect-[4/3] sm:aspect-[3/2] md:aspect-[4/3] lg:aspect-[4/5]
                rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm
                max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-none">
                <Image
                  src="/herobanner.png"
                  alt="Exquisite handcrafted marble deity sculpture from Jaipur artisans"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw"
                />
                
                {/* Elegant gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10" />
              </div>

              {/* TABLET-OPTIMIZED Floating badge - Smaller on tablets */}
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 border-2 border-amber-200 animate-float">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900">100%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 font-semibold">Handcrafted</div>
                  </div>
                </div>
              </div>

              {/* Corner decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-300/30 to-amber-400/30 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR - Only show on tablets/mobile when content might be below fold */}
        <div className="flex justify-center mt-8 lg:mt-12 animate-bounce">
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
            aria-label="Scroll down"
          >
            <span className="text-sm font-semibold">Discover More</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg className="w-full h-12 sm:h-16 lg:h-24 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z" fill="currentColor" opacity="0.8" />
        </svg>
      </div>
    </section>
  );
}
