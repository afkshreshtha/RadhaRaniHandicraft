"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-lg shadow-lg border-b-2 border-amber-100"
            : "bg-white border-b border-amber-100/50"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-20 sm:h-24 lg:h-28">  {/* Taller navbar */}
            {/* FIXED LOGO - Larger responsive rectangle */}
            <Link
              href="/"
              className="relative flex-shrink-0 group"
              aria-label="RadhaRani Handicrafts Home"
            >
              <div className="w-24 h-16 sm:w-32 sm:h-20 lg:w-40 lg:h-24 relative">  {/* Bigger base sizes */}
                <Image
                  src="/bg-logo.png"
                  alt="RadhaRani Handicrafts - Authentic Marble Deities"
                  fill
                  sizes="100vw"
                  className="object-contain object-center drop-shadow-md"
                  priority
                />
              </div>
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
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-amber-600
