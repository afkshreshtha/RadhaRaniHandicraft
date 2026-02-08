"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Search, Package } from "lucide-react";
import { useState } from "react";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-100">
          {/* Hero Section with Decorative Elements */}
          <div className="relative h-80 w-full bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
            {/* Animated Background Circles */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-yellow-400/30 rounded-full animate-pulse"></div>
              <div
                className="absolute bottom-10 right-10 w-40 h-40 border-4 border-amber-400/30 rounded-full animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-orange-400/20 rounded-full animate-pulse"
                style={{ animationDelay: "500ms" }}
              ></div>
            </div>

            {/* Central 404 Display */}
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-600 bg-clip-text text-transparent leading-none drop-shadow-lg">
                  404
                </div>
              </div>

              {/* Decorative Icons */}
              <div className="flex justify-center gap-8 text-5xl sm:text-6xl">
                <div
                  className="animate-bounce"
                  style={{ animationDelay: "0ms" }}
                >
                  🕉️
                </div>
                <div
                  className="animate-bounce"
                  style={{ animationDelay: "200ms" }}
                >
                  🪷
                </div>
                <div
                  className="animate-bounce"
                  style={{ animationDelay: "400ms" }}
                >
                  🙏
                </div>
              </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-6 right-6 text-6xl opacity-20 animate-spin-slow">
              ⚜️
            </div>
            <div className="absolute bottom-6 left-6 text-5xl opacity-20 animate-pulse">
              ✨
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-12 text-center">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Sacred Path Not Found
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-3 max-w-2xl mx-auto">
              The divine journey you seek does not exist in our temple of
              treasures.
            </p>
            <p className="text-base text-gray-500 mb-8">
              Perhaps the spiritual artifact has been moved or the path has
              changed.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-amber-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search for deities, materials, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-amber-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-base"
                />
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Button
                asChild
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Return to Home
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-2 border-amber-300 text-amber-900 hover:bg-amber-50 font-semibold py-6 px-8 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <Link href="/products" className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Browse Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="border-t-2 border-amber-100 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Explore Our Sacred Collection
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link
                  href="/products"
                  className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <img
                      width="35"
                      height="35"
                      src="https://img.icons8.com/fluency/48/product.png"
                      alt="product"
                    />
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    All Products
                  </p>
                </Link>

                <Link
                  href="/categories"
                  className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <img
                      width="35"
                      height="35"
                      src="https://img.icons8.com/comic/100/categorize.png"
                      alt="categorize"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Categories
                  </p>
                </Link>

                <Link
                  href="/about"
                  className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <img
                      width="35"
                      height="35"
                      src="https://img.icons8.com/color/48/about.png"
                      alt="about"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    About Us
                  </p>
                </Link>

                <Link
                  href="/contact"
                  className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    📞
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Contact</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Lost your way?{" "}
            <Link
              href="/contact"
              className="text-yellow-700 hover:text-yellow-800 font-semibold underline"
            >
              Let our artisans guide you
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
