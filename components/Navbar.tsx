"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Prevent iOS bounce scroll
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About Us" },
    { href: "/our-stores", label: "Our Stores" },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0   left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-amber-200/50"
            : "bg-white/80 backdrop-blur-sm border-b border-amber-100/30"
        }`}
      >
        <div className="max-w-[1920px]  mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Logo - Responsive sizing */}
            <Link
              href="/"
              className="relative flex-shrink-0 group z-50"
              aria-label="RadhaRani Handicrafts Home"
            >
              <div className="relative w-20 h-12 sm:w-28 sm:h-16 lg:w-36 lg:h-20 transition-all duration-300">
                <Image
                  src="/bg-logo.png"
                  alt="RadhaRani Handicrafts"
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 144px"
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              {/* Logo glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/30 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10 scale-150" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 xl:px-5 py-2.5 text-gray-700 hover:text-amber-700 font-semibold text-sm xl:text-base transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 transition-all duration-300 group-hover:w-[calc(100%-2rem)] rounded-full" />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-r from-[#25D366] via-[#1da851] to-[#128C7E] text-white px-5 xl:px-6 py-2.5 xl:py-3 rounded-full font-bold text-sm xl:text-base transition-all duration-300 hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 xl:w-5 xl:h-5" />
                <span>WhatsApp</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </a>
            </div>

            {/* Mobile Menu Toggle - Enhanced */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative p-2.5 rounded-2xl text-gray-700 hover:text-amber-700 bg-amber-50/50 hover:bg-amber-100 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute top-1.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute top-4.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Smooth fade */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md z-[60] lg:hidden transition-all duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer - Slide from right */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:max-w-sm bg-gradient-to-br from-white via-amber-50/30 to-white z-[70] transform transition-all duration-500 ease-out lg:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header - Gradient */}
        <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-6 flex items-center justify-between overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-1000" />
          </div>

          <div className="relative w-24 h-16 sm:w-28 sm:h-20">
            <Image
              src="/bg-logo.png"
              alt="RadhaRani Handicrafts"
              fill
              sizes="112px"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="relative p-2.5 rounded-full text-white hover:bg-white/20 active:scale-90 transition-all duration-200"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation Links - Staggered animation */}
        <nav className="px-4 py-6 h-[calc(100%-120px)] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between px-5 py-4 text-gray-800 hover:text-amber-700 font-semibold text-base rounded-2xl bg-white/60 hover:bg-amber-50 active:scale-[0.98] transition-all duration-300 border border-amber-100 hover:border-amber-300 hover:shadow-lg ${
                  isOpen
                    ? "animate-slideIn"
                    : ""
                }`}
                style={{
                  animationDelay: isOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-5 h-5 text-amber-600 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ))}

            {/* Divider with gradient */}
            <div className="py-4">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </div>

            {/* WhatsApp Button - Mobile */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group relative overflow-hidden bg-gradient-to-r from-[#25D366] via-[#1da851] to-[#128C7E] text-white px-6 py-5 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 border-2 border-[#1da851]"
            >
              <Phone className="w-6 h-6 animate-pulse" />
              <span>Contact via WhatsApp</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-700" />
            </a>

            {/* Info Card - Enhanced */}
            <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 rounded-3xl border-2 border-amber-200 shadow-lg relative overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/50 to-transparent rounded-bl-full" />
              
              <div className="relative">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  We're Here to Help!
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Have questions about our handcrafted marble deities? Reach out anytime!
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}
