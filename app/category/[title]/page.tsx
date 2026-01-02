"use client";

import { client } from "@/sanity.cli";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Package,
  SlidersHorizontal,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Format price in Indian currency format
const formatIndianCurrency = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage
const calculateDiscount = (
  originalPrice: number,
  currentPrice: number
): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Fetch functions
const fetchCategoryData = async (slug: string) => {
  return await client.fetch(
    `
    *[_type == "category" && (slug.current == $slug || slug == $slug)][0] {
      title,
      "images": images[].asset->url,
      "mainImage": images[0].asset->url,
      description,
      slug
    }
  `,
    { slug }
  );
};

const fetchCategoryProducts = async (slug: string) => {
  return await client.fetch(
    `
    *[_type == "product" && references(*[_type == "category" && (slug.current == $slug || slug == $slug)]._id)] {
      _id,
      name,
      slug,
      price,
      actual_price,
      paintingStyle,
      "images": images[].asset->url,
      "mainImage": images[0].asset->url,
      featured,
      material->{title, slug},
      dimensions {
        length {
          value,
          unit->{title, symbol}
        },
        width {
          value,
          unit->{title, symbol}
        },
        height {
          value,
          unit->{title, symbol}
        }
      }
    }
  `,
    { slug }
  );
};

const CategoryDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.title as string;

  // TanStack Query - Fetch category
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchCategoryData(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  // TanStack Query - Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["categoryProducts", slug],
    queryFn: () => fetchCategoryProducts(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = categoryLoading || productsLoading;

  // Calculate dynamic max price from products
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    const prices = products.map((p: any) =>
      parseFloat(p.price || p.actual_price || 0)
    );
    const max = Math.max(...prices);
    // Round up to nearest 10000
    return Math.ceil(max / 10000) * 10000;
  }, [products]);

  // Initialize state from URL with dynamic max
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPaintingStyles, setSelectedPaintingStyles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxProductPrice]);

  // Update price range when max price changes
  useEffect(() => {
    const minFromUrl = parseInt(searchParams.get("minPrice") || "0");
    const maxFromUrl = parseInt(searchParams.get("maxPrice") || String(maxProductPrice));
    
    setPriceRange([minFromUrl, Math.min(maxFromUrl, maxProductPrice)]);
    setSelectedMaterials(searchParams.get("materials")?.split(",").filter(Boolean) || []);
    setSelectedPaintingStyles(searchParams.get("styles")?.split(",").filter(Boolean) || []);
    setSortBy(searchParams.get("sort") || "featured");
    setSearchQuery(searchParams.get("search") || "");
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams, maxProductPrice]);

  const productsPerPage = 12;

  // Extract unique materials and painting styles
  const { materials, paintingStyles } = useMemo(() => {
    const uniqueMaterials = products.reduce((acc: any[], product: any) => {
      if (
        product.material &&
        !acc.some((m) => m.slug.current === product.material.slug.current)
      ) {
        acc.push(product.material);
      }
      return acc;
    }, []);

    const uniquePaintingStyles = [
      ...new Set(
        products
          .filter((p: any) => p.paintingStyle)
          .map((p: any) => p.paintingStyle)
      ),
    ];

    return { materials: uniqueMaterials, paintingStyles: uniquePaintingStyles };
  }, [products]);

  // Update URL
  const updateURL = useCallback(
    (newParams: any) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined) return;

        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(","));
          } else {
            params.delete(key);
          }
        } else if (typeof value === "string") {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        } else if (typeof value === "number") {
          if (
            (key === "minPrice" && value > 0) ||
            (key === "maxPrice" && value < maxProductPrice) ||
            (key === "page" && value > 1)
          ) {
            params.set(key, value.toString());
          } else if (
            (key === "minPrice" && value === 0) ||
            (key === "maxPrice" && value === maxProductPrice) ||
            (key === "page" && value === 1)
          ) {
            params.delete(key);
          }
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router, maxProductPrice]
  );

  // Apply filters and sort
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(
        (p) => p.material && selectedMaterials.includes(p.material.slug.current)
      );
    }

    // Painting style filter
    if (selectedPaintingStyles.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.paintingStyle && selectedPaintingStyles.includes(p.paintingStyle)
      );
    }

    // Price range filter - FIXED: Now uses dynamic max
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price || p.actual_price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            parseFloat(a.price || a.actual_price || 0) -
            parseFloat(b.price || b.actual_price || 0)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            parseFloat(b.price || b.actual_price || 0) -
            parseFloat(a.price || a.actual_price || 0)
        );
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b._createdAt || 0).getTime() -
            new Date(a._createdAt || 0).getTime()
        );
        break;
      case "featured":
      default:
        filtered.sort(
          (a, b) =>
            (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0)
        );
    }

    return filtered;
  }, [
    products,
    searchQuery,
    selectedMaterials,
    selectedPaintingStyles,
    sortBy,
    priceRange,
  ]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Filter handlers
  const toggleMaterial = (slugCurrent: string) => {
    const newMaterials = selectedMaterials.includes(slugCurrent)
      ? selectedMaterials.filter((id) => id !== slugCurrent)
      : [...selectedMaterials, slugCurrent];

    setSelectedMaterials(newMaterials);
    setCurrentPage(1);
    updateURL({ materials: newMaterials, page: 1 });
  };

  const togglePaintingStyle = (style: string) => {
    const newStyles = selectedPaintingStyles.includes(style)
      ? selectedPaintingStyles.filter((s) => s !== style)
      : [...selectedPaintingStyles, style];

    setSelectedPaintingStyles(newStyles);
    setCurrentPage(1);
    updateURL({ styles: newStyles, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    updateURL({ sort: value, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateURL({ search: value, page: 1 });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceChangeComplete = () => {
    setCurrentPage(1);
    updateURL({ minPrice: priceRange[0], maxPrice: priceRange[1], page: 1 });
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateURL({ page: pageNumber });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSelectedMaterials([]);
    setSelectedPaintingStyles([]);
    setSortBy("featured");
    setSearchQuery("");
    setPriceRange([0, maxProductPrice]);
    setCurrentPage(1);
    updateURL({
      materials: [],
      styles: [],
      sort: "featured",
      search: "",
      minPrice: 0,
      maxPrice: maxProductPrice,
      page: 1,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-amber-50 via-white to-yellow-50 pt-20 sm:pt-24 lg:pt-28">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-spin border-t-yellow-600 shadow-lg"></div>
          <div className="absolute inset-4 rounded-full border-4 border-yellow-100 animate-spin border-b-amber-600 animation-delay-150"></div>
          <div className="absolute inset-8 rounded-full border-4 border-amber-100 animate-spin border-r-yellow-500 animation-delay-300"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
          Loading Sacred Collection
        </h2>
        <p className="text-gray-600">Curating divine perfection for you...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 lg:pt-28">
        <Package className="w-24 h-24 text-amber-300 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Category not found
        </h1>
        <p className="text-gray-600 mb-8">
          This category doesn't exist or has been removed
        </p>
        <Link
          href="/categories"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg font-semibold"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Categories
        </Link>
      </div>
    );
  }

  // JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `https://radharanihandicrafts.com/category/${slug}`,
    numberOfItems: filteredProducts.length,
    itemListElement: currentProducts.map((product: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.mainImage,
        offers: {
          "@type": "Offer",
          price: parseFloat(product.price || product.actual_price || 0),
          priceCurrency: "INR",
        },
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30 ">
        {/* Hero Section */}
        <header className="relative bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 py-12 sm:py-16 lg:py-20 border-b-2 border-amber-100 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="max-w-3xl w-full animate-fade-in-up">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-600 mb-4 flex-wrap" aria-label="Breadcrumb">
                  <Link
                    href="/"
                    className="hover:text-yellow-700 transition flex items-center font-medium"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Home
                  </Link>
                  <span className="mx-2">/</span>
                  <Link
                    href="/categories"
                    className="hover:text-yellow-700 transition font-medium"
                  >
                    Categories
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="text-yellow-700 font-bold">
                    {category.title}
                  </span>
                </nav>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
                  {category.title}
                </h1>
                {category.description && (
                  <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-amber-200">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span className="font-bold text-gray-900">{products.length}</span>
                    <span className="text-gray-600">Products</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-amber-200">
                    <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-gray-900">{materials.length}</span>
                    <span className="text-gray-600">Materials</span>
                  </div>
                </div>
              </div>

              {category.mainImage && (
                <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0 transform hover:scale-105 transition-transform duration-500 animate-fade-in">
                  <Image
                    src={category.mainImage}
                    alt={`${category.title} - Marble Collection`}
                    width={320}
                    height={320}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-10 py-4 text-base border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all bg-white"
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-amber-100 transition"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-amber-300 rounded-2xl shadow-sm lg:hidden text-base font-semibold text-amber-900 hover:bg-amber-50 transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {(selectedMaterials.length > 0 ||
                selectedPaintingStyles.length > 0) && (
                <span className="ml-1 bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {selectedMaterials.length + selectedPaintingStyles.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-white overflow-y-auto shadow-2xl animate-slide-in-left">
                {/* Header */}
                <div className="px-6 py-5 flex justify-between items-center border-b-2 border-amber-200 sticky top-0 bg-gradient-to-r from-yellow-600 to-amber-600 z-10">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Filter Content */}
                <div className="px-6 pb-24">
                  {/* Sort Options */}
                  <div className="py-6 border-b border-amber-200">
                    <h3 className="text-base font-bold mb-3 flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                      Sort By
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-amber-50 font-medium transition-all"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="py-6 border-b border-amber-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-bold flex items-center">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                        Price Range
                      </h3>
                      {(priceRange[0] !== 0 || priceRange[1] !== maxProductPrice) && (
                        <button
                          onClick={() => {
                            setPriceRange([0, maxProductPrice]);
                            updateURL({ minPrice: 0, maxPrice: maxProductPrice, page: 1 });
                          }}
                          className="text-xs text-yellow-700 hover:underline font-medium"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Price Display */}
                    <div className="mb-4 flex justify-between items-center text-sm bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 rounded-xl border-2 border-amber-200">
                      <span className="font-bold text-gray-900">
                        {formatIndianCurrency(priceRange[0])}
                      </span>
                      <span className="text-amber-600 font-bold">—</span>
                      <span className="font-bold text-gray-900">
                        {formatIndianCurrency(priceRange[1])}
                      </span>
                    </div>

                    {/* Range Slider */}
                    <div className="mb-4 px-1">
                      <RangeSlider
                        min={0}
                        max={maxProductPrice}
                        step={1000}
                        value={priceRange}
                        onInput={handlePriceChange}
                        onThumbDragEnd={handlePriceChangeComplete}
                        className="range-slider-primary"
                      />
                    </div>

                    {/* Input Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-2 font-semibold">
                          Min Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(Number(e.target.value), priceRange[1] - 1000)
                            );
                            setPriceRange([value, priceRange[1]]);
                          }}
                          onBlur={handlePriceChangeComplete}
                          className="w-full px-3 py-3 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="₹0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2 font-semibold">
                          Max Price
                        </label>
                        <input
                          type="number"
                          min={priceRange[0]}
                          max={maxProductPrice}
                          value={priceRange[1]}
                          onChange={(e) => {
                            const value = Math.min(
                              maxProductPrice,
                              Math.max(Number(e.target.value), priceRange[0] + 1000)
                            );
                            setPriceRange([priceRange[0], value]);
                          }}
                          onBlur={handlePriceChangeComplete}
                          className="w-full px-3 py-3 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder={`₹${formatIndianCurrency(maxProductPrice)}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Materials */}
                  {materials.length > 0 && (
                    <div className="py-6 border-b border-amber-200">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-bold flex items-center">
                          <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                          Materials
                        </h3>
                        {selectedMaterials.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedMaterials([]);
                              updateURL({ materials: [], page: 1 });
                            }}
                            className="text-sm text-yellow-700 hover:underline font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {materials.map((material) => (
                          <label
                            key={material.slug.current}
                            className="flex items-center cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMaterials.includes(
                                material.slug.current
                              )}
                              onChange={() =>
                                toggleMaterial(material.slug.current)
                              }
                              className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 transition-all"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors font-medium">
                              {material.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Painting Styles */}
                  {paintingStyles.length > 0 && (
                    <div className="py-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-bold flex items-center">
                          <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                          Painting Style
                        </h3>
                        {selectedPaintingStyles.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedPaintingStyles([]);
                              updateURL({ styles: [], page: 1 });
                            }}
                            className="text-sm text-yellow-700 hover:underline font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {paintingStyles.map((style) => (
                          <label
                            key={style}
                            className="flex items-center cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPaintingStyles.includes(style)}
                              onChange={() => togglePaintingStyle(style)}
                              className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 transition-all"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors font-medium">
                              {style}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-amber-200 space-y-2 sm:w-96 shadow-2xl">
                  <button
                    onClick={resetFilters}
                    className="w-full py-3 bg-white border-2 border-amber-300 text-amber-900 font-bold rounded-xl hover:bg-amber-50 transition-all transform hover:scale-105"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg transform hover:scale-105"
                  >
                    Show {filteredProducts.length} Products
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-amber-100 sticky top-24 hover:shadow-2xl transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    Filters
                  </h2>
                  {(selectedMaterials.length > 0 ||
                    selectedPaintingStyles.length > 0 ||
                    sortBy !== "featured" ||
                    priceRange[0] !== 0 ||
                    priceRange[1] !== maxProductPrice) && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-yellow-700 hover:underline font-bold"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Sort Options */}
                <div className="mb-6 pb-6 border-b-2 border-amber-100">
                  <h3 className="text-base font-bold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm bg-amber-50 font-medium transition-all"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b-2 border-amber-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                      Price Range
                    </h3>
                    {(priceRange[0] !== 0 || priceRange[1] !== maxProductPrice) && (
                      <button
                        onClick={() => {
                          setPriceRange([0, maxProductPrice]);
                          updateURL({ minPrice: 0, maxPrice: maxProductPrice, page: 1 });
                        }}
                        className="text-xs text-yellow-700 hover:underline font-medium"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="mb-4 flex justify-between items-center text-sm bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-3 rounded-xl border-2 border-amber-200">
                    <span className="font-bold text-gray-900">
                      {formatIndianCurrency(priceRange[0])}
                    </span>
                    <span className="text-amber-600 font-bold">—</span>
                    <span className="font-bold text-gray-900">
                      {formatIndianCurrency(priceRange[1])}
                    </span>
                  </div>

                  <div className="mb-4">
                    <RangeSlider
                      min={0}
                      max={maxProductPrice}
                      step={1000}
                      value={priceRange}
                      onInput={handlePriceChange}
                      onThumbDragEnd={handlePriceChangeComplete}
                      className="range-slider-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2 font-semibold">
                        Min
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const value = Math.max(
                            0,
                            Math.min(Number(e.target.value), priceRange[1] - 1000)
                          );
                          setPriceRange([value, priceRange[1]]);
                        }}
                        onBlur={handlePriceChangeComplete}
                        className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                        placeholder="₹0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2 font-semibold">
                        Max
                      </label>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max={maxProductPrice}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const value = Math.min(
                            maxProductPrice,
                            Math.max(Number(e.target.value), priceRange[0] + 1000)
                          );
                          setPriceRange([priceRange[0], value]);
                        }}
                        onBlur={handlePriceChangeComplete}
                        className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                        placeholder={`₹${maxProductPrice}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Materials */}
                {materials.length > 0 && (
                  <div className="mb-6 pb-6 border-b-2 border-amber-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-bold flex items-center">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                        Material
                      </h3>
                      {selectedMaterials.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedMaterials([]);
                            updateURL({ materials: [], page: 1 });
                          }}
                          className="text-sm text-yellow-700 hover:underline font-medium"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <label
                          key={material.slug.current}
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(
                              material.slug.current
                            )}
                            onChange={() =>
                              toggleMaterial(material.slug.current)
                            }
                            className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded transition-all"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors font-medium">
                            {material.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Painting Styles */}
                {paintingStyles.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-bold flex items-center">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2" />
                        Painting Style
                      </h3>
                      {selectedPaintingStyles.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedPaintingStyles([]);
                            updateURL({ styles: [], page: 1 });
                          }}
                          className="text-sm text-yellow-700 hover:underline font-medium"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {paintingStyles.map((style) => (
                        <label
                          key={style}
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPaintingStyles.includes(style)}
                            onChange={() => togglePaintingStyle(style)}
                            className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded transition-all"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors font-medium">
                            {style}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Products Section */}
            <section className="flex-grow">
              {/* Active Filters Tags */}
              {(selectedMaterials.length > 0 ||
                selectedPaintingStyles.length > 0 ||
                priceRange[0] !== 0 ||
                priceRange[1] !== maxProductPrice) && (
                <div className="mb-6 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                  {selectedMaterials.map((slug) => {
                    const material = materials.find(
                      (m) => m.slug.current === slug
                    );
                    return material ? (
                      <span
                        key={slug}
                        className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300 hover:border-yellow-400 transition-all"
                      >
                        {material.title}
                        <button
                          onClick={() => toggleMaterial(slug)}
                          className="ml-2 p-1 rounded-full hover:bg-yellow-200 transition"
                          aria-label={`Remove ${material.title} filter`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedPaintingStyles.map((style) => (
                    <span
                      key={style}
                      className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300 hover:border-yellow-400 transition-all"
                    >
                      {style}
                      <button
                        onClick={() => togglePaintingStyle(style)}
                        className="ml-2 p-1 rounded-full hover:bg-yellow-200 transition"
                        aria-label={`Remove ${style} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(priceRange[0] !== 0 || priceRange[1] !== maxProductPrice) && (
                    <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300 hover:border-yellow-400 transition-all">
                      {formatIndianCurrency(priceRange[0])} -{" "}
                      {formatIndianCurrency(priceRange[1])}
                      <button
                        onClick={() => {
                          setPriceRange([0, maxProductPrice]);
                          updateURL({ minPrice: 0, maxPrice: maxProductPrice, page: 1 });
                        }}
                        className="ml-2 p-1 rounded-full hover:bg-yellow-200 transition"
                        aria-label="Remove price filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Results Count */}
              <div className="mb-6 flex justify-between items-center text-base bg-white px-6 py-4 rounded-2xl border-2 border-amber-100 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                <p className="text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-700">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
                <p className="text-gray-500 hidden sm:block font-semibold">
                  Page {currentPage} of {totalPages || 1}
                </p>
              </div>

              {/* Products Grid */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-2 border-dashed border-amber-200">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Search className="w-12 h-12 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    No products found
                  </h3>
                  <p className="text-base text-gray-600 mb-6">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold rounded-2xl hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg transform hover:scale-105"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {currentProducts.map((product, index) => {
                      const price = parseFloat(
                        product.price || product.actual_price || 0
                      );
                      const actualPrice = product.actual_price
                        ? parseFloat(product.actual_price)
                        : null;
                      const hasDiscount = actualPrice && actualPrice > price;

                      return (
                        <Link
                          href={`/product/${product.slug?.current || product.slug}`}
                          key={product._id}
                          className="group animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden h-full flex flex-col transition-all duration-500 border-2 border-amber-100 hover:border-amber-300 transform hover:-translate-y-2 hover:scale-[1.02]">
                            {/* Product Image */}
                            <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
                              {product.mainImage ? (
                                <Image
                                  src={product.mainImage}
                                  alt={`${product.name} - Handcrafted Marble Deity`}
                                  fill
                                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  loading={index < 6 ? "eager" : "lazy"}
                                  priority={index < 6}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                                  <Package className="w-12 h-12 text-gray-300" />
                                  <span className="text-xs text-gray-400 mt-2">
                                    No image
                                  </span>
                                </div>
                              )}

                              {/* Badges */}
                              <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                                {hasDiscount && (
                                  <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
                                    {calculateDiscount(actualPrice!, price)}% OFF
                                  </div>
                                )}
                                {product.featured && (
                                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center shadow-lg ml-auto">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Featured
                                  </div>
                                )}
                              </div>

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Product Details */}
                            <div className="p-5 flex flex-col flex-grow">
                              <div className="flex-grow">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-yellow-700 transition-colors mb-2 line-clamp-2 leading-tight">
                                  {product.name}
                                </h3>

                                {/* Dimensions */}
                                {product.dimensions && (
                                  <div className="hidden sm:block text-xs text-gray-600 mb-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 inline-block">
                                    <span className="font-semibold text-gray-700">
                                      {[
                                        product.dimensions?.height?.value &&
                                          `H:${product.dimensions.height.value}${
                                            product.dimensions.height?.unit
                                              ?.symbol || '"'
                                          }`,
                                        product.dimensions?.width?.value &&
                                          `W:${product.dimensions.width?.value}${
                                            product.dimensions.width?.unit
                                              ?.symbol || '"'
                                          }`,
                                        product.dimensions?.length?.value &&
                                          `L:${product.dimensions.length.value}${
                                            product.dimensions.length?.unit
                                              ?.symbol || '"'
                                          }`,
                                      ]
                                        .filter(Boolean)
                                        .join(" × ")}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Price Section */}
                              <div className="mt-4 space-y-3">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {formatIndianCurrency(price)}
                                  </p>
                                  {hasDiscount && (
                                    <p className="text-sm text-gray-500 line-through">
                                      {formatIndianCurrency(actualPrice!)}
                                    </p>
                                  )}
                                </div>

                                {/* Tags */}
                                <div className="flex gap-2 flex-wrap">
                                  {product.paintingStyle && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300">
                                      {product.paintingStyle}
                                    </span>
                                  )}
                                  {product.material && (
                                    <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-300">
                                      {product.material.title}
                                    </span>
                                  )}
                                </div>

                                {/* View Button */}
                                <button className="w-full py-3 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav
                      className="mt-12 flex justify-center animate-fade-in-up"
                      style={{ animationDelay: "0.6s" }}
                      aria-label="Pagination"
                    >
                      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200 p-2">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Page Numbers */}
                        <div className="hidden sm:flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => paginate(pageNum)}
                                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                                    currentPage === pageNum
                                      ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg scale-110"
                                      : "hover:bg-amber-50 text-gray-700"
                                  }`}
                                  aria-label={`Go to page ${pageNum}`}
                                  aria-current={
                                    currentPage === pageNum ? "page" : undefined
                                  }
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}

                          {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                              <span className="px-2 text-gray-400">...</span>
                              <button
                                onClick={() => paginate(totalPages)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-amber-50 text-sm font-bold text-gray-700"
                                aria-label={`Go to page ${totalPages}`}
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>

                        {/* Mobile Page Indicator */}
                        <div className="sm:hidden px-4 py-2 text-sm font-bold text-gray-700">
                          {currentPage} / {totalPages}
                        </div>

                        <button
                          onClick={() =>
                            paginate(Math.min(totalPages, currentPage + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </nav>
                  )}
                </>
              )}
            </section>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in-left {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }

          .animate-slide-in-left {
            animation: slide-in-left 0.3s ease-out forwards;
          }

          .animation-delay-150 {
            animation-delay: 150ms;
          }

          .animation-delay-300 {
            animation-delay: 300ms;
          }

          .animation-delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </main>
    </>
  );
};

export default CategoryDetailPage;
