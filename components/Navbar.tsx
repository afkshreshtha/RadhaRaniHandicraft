'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/98 backdrop-blur-lg shadow-lg border-b-2 border-amber-100' 
            : 'bg-white border-b border-amber-100/50'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            
            {/* Logo - Responsive Image */}
            <Link 
              href="/" 
              className="relative flex-shrink-0 group"
              aria-label="RadhaRani Handicraft Home"
            >
              <div className={`relative transition-all duration-300 ${
                scrolled 
                  ? 'w-32 h-10 sm:w-40 sm:h-12 lg:w-48 lg:h-14' 
                  : 'w-36 h-12 sm:w-44 sm:h-14 lg:w-52 lg:h-16'
              }`}>
                <Image
                  src="/logo.png" // Replace with your logo path
                  alt="RadhaRani Handicraft - Authentic Marble Deities"
                  fill
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
                  priority
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 500px"
                />
              </div>
              
              {/* Optional: Glowing effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-amber-400/20 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link 
                href="/products" 
                className="relative px-4 py-2 text-gray-700 hover:text-amber-700 font-semibold text-base transition-colors duration-200 group"
              >
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-amber-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              
              <Link 
                href="/categories" 
                className="relative px-4 py-2 text-gray-700 hover:text-amber-700 font-semibold text-base transition-colors duration-200 group"
              >
                Categories
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-amber-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              
              <Link 
                href="/about" 
                className="relative px-4 py-2 text-gray-700 hover:text-amber-700 font-semibold text-base transition-colors duration-200 group"
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-amber-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>

              <Link 
                href="/our-stores" 
                className="relative px-4 py-2 text-gray-700 hover:text-amber-700 font-semibold text-base transition-colors duration-200 group"
              >
                Our Stores
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-amber-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#0A5D4E] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </a>
            </div>

            {/* Mobile/Tablet menu toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 border-2 border-transparent hover:border-amber-200"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile/Tablet Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-6 py-5 flex items-center justify-between">
          <div className="relative w-32 h-10">
            <Image
              src="/bg-logo.png" // White version of logo for colored background
              alt="RadhaRani Handicraft"
              fill
              className="" // Makes logo white
              sizes="128px"
            />
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="px-6 py-6 h-[calc(100%-80px)] overflow-y-auto">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/products" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between px-4 py-4 text-gray-800 hover:text-amber-700 font-semibold text-base rounded-xl hover:bg-amber-50 transition-all duration-200 border-2 border-transparent hover:border-amber-200"
            >
              <span>Products</span>
              <ChevronDown className="w-5 h-5 -rotate-90 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link 
              href="/categories" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between px-4 py-4 text-gray-800 hover:text-amber-700 font-semibold text-base rounded-xl hover:bg-amber-50 transition-all duration-200 border-2 border-transparent hover:border-amber-200"
            >
              <span>Categories</span>
              <ChevronDown className="w-5 h-5 -rotate-90 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link 
              href="/about" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between px-4 py-4 text-gray-800 hover:text-amber-700 font-semibold text-base rounded-xl hover:bg-amber-50 transition-all duration-200 border-2 border-transparent hover:border-amber-200"
            >
              <span>About Us</span>
              <ChevronDown className="w-5 h-5 -rotate-90 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link 
              href="/our-stores" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between px-4 py-4 text-gray-800 hover:text-amber-700 font-semibold text-base rounded-xl hover:bg-amber-50 transition-all duration-200 border-2 border-transparent hover:border-amber-200"
            >
              <span>Our Stores</span>
              <ChevronDown className="w-5 h-5 -rotate-90 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Divider */}
            <div className="py-4">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            </div>

            {/* WhatsApp Button - Mobile */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group relative overflow-hidden bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#0A5D4E] text-white px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              <span>Contact via WhatsApp</span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </a>

            {/* Info Card */}
            <div className="mt-6 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                We're Here to Help!
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Have questions about our handcrafted marble deities? Reach out anytime!
              </p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
