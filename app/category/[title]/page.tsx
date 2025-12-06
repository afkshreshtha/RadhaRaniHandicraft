"use client";

import { client } from "@/sanity.cli";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
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
} from "lucide-react";

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

const CategoryDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.title;

  // Initialize state from URL
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states initialized from URL
  const [materials, setMaterials] = useState<any[]>([]);
  const [paintingStyles, setPaintingStyles] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    searchParams.get("materials")?.split(",").filter(Boolean) || []
  );
  const [selectedPaintingStyles, setSelectedPaintingStyles] = useState<
    string[]
  >(searchParams.get("styles")?.split(",").filter(Boolean) || []);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get("minPrice") || "0"),
    parseInt(searchParams.get("maxPrice") || "50000"),
  ]);

  const productsPerPage = 12;

  const updateURL = useCallback(
    (newParams: any) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update all parameters
      if (newParams.search !== undefined) {
        if (newParams.search) {
          params.set("search", newParams.search);
        } else {
          params.delete("search");
        }
      }

      if (newParams.materials !== undefined) {
        if (newParams.materials.length > 0) {
          params.set("materials", newParams.materials.join(","));
        } else {
          params.delete("materials");
        }
      }

      if (newParams.styles !== undefined) {
        if (newParams.styles.length > 0) {
          params.set("styles", newParams.styles.join(","));
        } else {
          params.delete("styles");
        }
      }

      if (newParams.sort !== undefined) {
        if (newParams.sort !== "featured") {
          params.set("sort", newParams.sort);
        } else {
          params.delete("sort");
        }
      }

      if (newParams.page !== undefined) {
        if (newParams.page > 1) {
          params.set("page", newParams.page.toString());
        } else {
          params.delete("page");
        }
      }

      if (newParams.minPrice !== undefined) {
        if (newParams.minPrice > 0) {
          params.set("minPrice", newParams.minPrice.toString());
        } else {
          params.delete("minPrice");
        }
      }

      if (newParams.maxPrice !== undefined) {
        if (newParams.maxPrice < 50000) {
          params.set("maxPrice", newParams.maxPrice.toString());
        } else {
          params.delete("maxPrice");
        }
      }

      // Push new URL without page reload
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const [categoryData, productsData] = await Promise.all([
          client.fetch(
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
          ),

          client.fetch(
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
          ),
        ]);

        if (!categoryData) throw new Error("Category not found");

        setCategory(categoryData);
        setProducts(productsData);

        // Extract unique materials and painting styles
        const uniqueMaterials = productsData.reduce(
          (acc: any[], product: any) => {
            if (
              product.material &&
              !acc.some((m) => m.slug.current === product.material.slug.current)
            ) {
              acc.push(product.material);
            }
            return acc;
          },
          []
        );

        const uniquePaintingStyles = [
          ...new Set(
            productsData
              .filter((p: any) => p.paintingStyle)
              .map((p: any) => p.paintingStyle)
          ),
        ];

        setMaterials(uniqueMaterials);
        setPaintingStyles(uniquePaintingStyles);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  // Apply filters and search
  useEffect(() => {
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

    // Price range filter
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
      case "featured":
      default:
        filtered.sort(
          (a, b) =>
            (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0)
        );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchQuery,
    selectedMaterials,
    selectedPaintingStyles,
    sortBy,
    products,
    priceRange,
  ]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleMaterial = (slugCurrent: string) => {
    const newMaterials = selectedMaterials.includes(slugCurrent)
      ? selectedMaterials.filter((id) => id !== slugCurrent)
      : [...selectedMaterials, slugCurrent];

    setSelectedMaterials(newMaterials);
    updateURL({ materials: newMaterials, page: 1 });
  };

  const togglePaintingStyle = (style: string) => {
    const newStyles = selectedPaintingStyles.includes(style)
      ? selectedPaintingStyles.filter((s) => s !== style)
      : [...selectedPaintingStyles, style];

    setSelectedPaintingStyles(newStyles);
    updateURL({ styles: newStyles, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL({ sort: value, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateURL({ search: value, page: 1 });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceChangeComplete = () => {
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
    setPriceRange([0, 50000]);
    setCurrentPage(1);
    updateURL({
      materials: [],
      styles: [],
      sort: "featured",
      search: "",
      minPrice: 0,
      maxPrice: 50000,
      page: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        {/* Enhanced marble-themed loading animation */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-spin border-t-yellow-600 shadow-lg"></div>
          <div className="absolute inset-4 rounded-full border-4 border-yellow-100 animate-spin border-b-amber-600"></div>
          <div className="absolute inset-8 rounded-full border-4 border-amber-100 animate-spin border-r-yellow-500"></div>
          <div className="absolute inset-12 rounded-full border-4 border-yellow-50 animate-spin border-l-amber-500"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
          Loading Sacred Collection
        </h2>
        <p className="text-gray-600">Carving divine perfection for you...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <Link
          href="/categories"
          className="mt-4 inline-flex items-center px-6 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-lg hover:from-yellow-700 hover:to-amber-700 transition"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  // SEO Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `https://yourdomain.com/category/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.mainImage,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
          },
        },
      })),
    },
  };

  return (
    <>
      <Head>
        <title>{`${category.title} - Handcrafted Products | Your Store Name`}</title>
        <meta
          name="description"
          content={
            category.description ||
            `Browse our collection of ${category.title} handcrafted products`
          }
        />
        <meta
          name="keywords"
          content={`${category.title}, handcrafted, artisan, ${paintingStyles.join(", ")}`}
        />
        <link
          rel="canonical"
          href={`https://yourdomain.com/category/${slug}`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${category.title} - Handcrafted Products`}
        />
        <meta property="og:description" content={category.description} />
        <meta
          property="og:image"
          content={category.mainImage || "/default-og-image.jpg"}
        />
        <meta
          property="og:url"
          content={`https://yourdomain.com/category/${slug}`}
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${category.title} - Handcrafted Products`}
        />
        <meta name="twitter:description" content={category.description} />
        <meta
          name="twitter:image"
          content={category.mainImage || "/default-og-image.jpg"}
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30 min-h-screen">
        {/* Hero Section - Enhanced with gradients */}
        <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 py-8 sm:py-12 border-b-2 border-amber-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="max-w-2xl w-full">
                {/* Breadcrumb */}
                <nav className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex-wrap">
                  <Link
                    href="/"
                    className="hover:text-yellow-700 transition flex items-center font-medium"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Home
                  </Link>
                  <span className="mx-2">/</span>
                  <Link
                    href="/categories"
                    className="hover:text-yellow-700 transition font-medium"
                  >
                    Categories
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="text-yellow-700 font-bold truncate max-w-[150px] sm:max-w-none">
                    {category.title}
                  </span>
                </nav>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                  {category.title}
                </h1>
                {category.description && (
                  <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>

              {category.mainImage && (
                <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src={category.mainImage}
                    alt={category.title}
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Search and Filter Bar - Enhanced */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-4 text-sm sm:text-base border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-amber-100 transition"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 sm:py-4 bg-white border-2 border-amber-300 rounded-xl shadow-sm lg:hidden text-sm sm:text-base font-medium text-amber-900 hover:bg-amber-50 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(selectedMaterials.length > 0 ||
                selectedPaintingStyles.length > 0) && (
                <span className="ml-1 bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {selectedMaterials.length + selectedPaintingStyles.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filters Overlay - Enhanced */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
              <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-white overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="px-4 py-4 flex justify-between items-center border-b-2 border-amber-200 sticky top-0 bg-gradient-to-r from-yellow-600 to-amber-600 z-10">
                  <h2 className="text-lg font-bold text-white">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Filter Content */}
                <div className="px-4 pb-24">
                  {/* Sort Options */}
                  <div className="py-5 border-b border-amber-200">
                    <h3 className="text-base font-semibold mb-3 flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                      Sort By
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-amber-50 font-medium"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Price Range with Slider */}
                  <div className="py-5 border-b border-amber-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-semibold flex items-center">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                        Price Range
                      </h3>
                      {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                        <button
                          onClick={() => {
                            setPriceRange([0, 50000]);
                            updateURL({ minPrice: 0, maxPrice: 50000, page: 1 });
                          }}
                          className="text-xs text-yellow-700 hover:underline font-medium"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Price Display */}
                    <div className="mb-4 flex justify-between items-center text-sm bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                      <span className="font-bold text-gray-900">
                        {formatIndianCurrency(priceRange[0])}
                      </span>
                      <span className="text-amber-600 font-medium">—</span>
                      <span className="font-bold text-gray-900">
                        {formatIndianCurrency(priceRange[1])}
                      </span>
                    </div>

                    {/* Range Slider */}
                    <div className="mb-4 px-1">
                      <RangeSlider
                        min={0}
                        max={50000}
                        step={500}
                        value={priceRange}
                        onInput={handlePriceChange}
                        onThumbDragEnd={handlePriceChangeComplete}
                        className="range-slider-primary"
                      />
                    </div>

                    {/* Input Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5 font-semibold">
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
                              Math.min(Number(e.target.value), priceRange[1] - 500)
                            );
                            setPriceRange([value, priceRange[1]]);
                          }}
                          onBlur={handlePriceChangeComplete}
                          className="w-full px-3 py-2.5 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="₹0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5 font-semibold">
                          Max Price
                        </label>
                        <input
                          type="number"
                          min={priceRange[0]}
                          max="50000"
                          value={priceRange[1]}
                          onChange={(e) => {
                            const value = Math.min(
                              50000,
                              Math.max(Number(e.target.value), priceRange[0] + 500)
                            );
                            setPriceRange([priceRange[0], value]);
                          }}
                          onBlur={handlePriceChangeComplete}
                          className="w-full px-3 py-2.5 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="₹50,000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Materials */}
                  {materials.length > 0 && (
                    <div className="py-5 border-b border-amber-200">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-semibold flex items-center">
                          <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
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
                      <div className="space-y-2.5">
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
                              className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                              {material.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Painting Styles */}
                  {paintingStyles.length > 0 && (
                    <div className="py-5 border-b border-amber-200">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-semibold flex items-center">
                          <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
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
                      <div className="space-y-2.5">
                        {paintingStyles.map((style) => (
                          <label
                            key={style}
                            className="flex items-center cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPaintingStyles.includes(style)}
                              onChange={() => togglePaintingStyle(style)}
                              className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                              {style}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Fixed at Bottom */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-amber-200 space-y-2 sm:w-96">
                  <button
                    onClick={resetFilters}
                    className="w-full py-3 bg-white border-2 border-amber-300 text-amber-900 font-semibold rounded-xl hover:bg-amber-50 transition-all"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg"
                  >
                    Show {filteredProducts.length} Products
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Desktop Filters Sidebar - Enhanced */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-amber-100 sticky top-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  {(selectedMaterials.length > 0 ||
                    selectedPaintingStyles.length > 0 ||
                    sortBy !== "featured" ||
                    priceRange[0] !== 0 ||
                    priceRange[1] !== 50000) && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-yellow-700 hover:underline font-semibold"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm bg-amber-50 font-medium"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Price Range with Slider - Desktop */}
                <div className="mb-6 pb-6 border-b-2 border-amber-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                      Price Range
                    </h3>
                    {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                      <button
                        onClick={() => {
                          setPriceRange([0, 50000]);
                          updateURL({ minPrice: 0, maxPrice: 50000, page: 1 });
                        }}
                        className="text-xs text-yellow-700 hover:underline font-medium"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Price Display */}
                  <div className="mb-4 flex justify-between items-center text-sm bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                    <span className="font-bold text-gray-900">
                      {formatIndianCurrency(priceRange[0])}
                    </span>
                    <span className="text-amber-600">—</span>
                    <span className="font-bold text-gray-900">
                      {formatIndianCurrency(priceRange[1])}
                    </span>
                  </div>

                  {/* Range Slider */}
                  <div className="mb-4">
                    <RangeSlider
                      min={0}
                      max={50000}
                      step={500}
                      value={priceRange}
                      onInput={handlePriceChange}
                      onThumbDragEnd={handlePriceChangeComplete}
                      className="range-slider-primary"
                    />
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1.5 font-semibold">
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
                            Math.min(Number(e.target.value), priceRange[1] - 500)
                          );
                          setPriceRange([value, priceRange[1]]);
                        }}
                        onBlur={handlePriceChangeComplete}
                        className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="₹0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1.5 font-semibold">
                        Max
                      </label>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="50000"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const value = Math.min(
                            50000,
                            Math.max(Number(e.target.value), priceRange[0] + 500)
                          );
                          setPriceRange([priceRange[0], value]);
                        }}
                        onBlur={handlePriceChangeComplete}
                        className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="₹50,000"
                      />
                    </div>
                  </div>
                </div>

                {/* Material Filter */}
                {materials.length > 0 && (
                  <div className="mb-6 pb-6 border-b-2 border-amber-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold flex items-center">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
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
                    <div className="space-y-2.5">
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
                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                            {material.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Painting Style Filter */}
                {paintingStyles.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold flex items-center">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
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
                    <div className="space-y-2.5">
                      {paintingStyles.map((style) => (
                        <label
                          key={style}
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPaintingStyles.includes(style)}
                            onChange={() => togglePaintingStyle(style)}
                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
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
            <div className="flex-grow">
              {/* Active Filters Tags - Enhanced */}
              {(selectedMaterials.length > 0 ||
                selectedPaintingStyles.length > 0 ||
                priceRange[0] !== 0 ||
                priceRange[1] !== 50000) && (
                <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
                  {selectedMaterials.map((slug) => {
                    const material = materials.find(
                      (m) => m.slug.current === slug
                    );
                    return material ? (
                      <span
                        key={slug}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300"
                      >
                        {material.title}
                        <button
                          onClick={() => toggleMaterial(slug)}
                          className="ml-2 p-0.5 rounded-full hover:bg-yellow-200 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedPaintingStyles.map((style) => (
                    <span
                      key={style}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300"
                    >
                      {style}
                      <button
                        onClick={() => togglePaintingStyle(style)}
                        className="ml-2 p-0.5 rounded-full hover:bg-yellow-200 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300">
                      {formatIndianCurrency(priceRange[0])} -{" "}
                      {formatIndianCurrency(priceRange[1])}
                      <button
                        onClick={() => {
                          setPriceRange([0, 50000]);
                          updateURL({ minPrice: 0, maxPrice: 50000, page: 1 });
                        }}
                        className="ml-2 p-0.5 rounded-full hover:bg-yellow-200 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Results Count - Enhanced */}
              <div className="mb-4 sm:mb-6 flex justify-between items-center text-sm sm:text-base bg-white px-5 py-3 rounded-xl border-2 border-amber-100 shadow-sm">
                <p className="text-gray-700">
                  <span className="font-bold text-yellow-700">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
                <p className="text-gray-500 hidden sm:block font-medium">
                  Page {currentPage} of {totalPages || 1}
                </p>
              </div>

              {/* Products Grid - ENHANCED WITH BEAUTIFUL DESIGN */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed border-amber-200">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    No products found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg text-sm sm:text-base"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {currentProducts.map((product) => {
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
                          className="group"
                        >
                          <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden h-full flex flex-col transition-all duration-300 border-2 border-amber-100 hover:border-amber-300 transform hover:-translate-y-1">
                            {/* Product Image with Full Display */}
                            <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
                              {product.mainImage ? (
                                <Image
                                  src={product.mainImage}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                  sizes="(max-width: 475px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                                  <svg
                                    className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="text-xs sm:text-sm text-gray-400 mt-2">
                                    No image
                                  </span>
                                </div>
                              )}

                              {/* Badges Container */}
                              <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                                {/* Discount Badge */}
                                {hasDiscount && (
                                  <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg z-10 animate-pulse">
                                    {calculateDiscount(actualPrice!, price)}% OFF
                                  </div>
                                )}

                                {/* Featured Badge */}
                                {product.featured && (
                                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center shadow-lg z-10 ml-auto">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Featured
                                  </div>
                                )}
                              </div>

                              {/* Quick View Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>

                            {/* Product Details */}
                            <div className="p-4 sm:p-5 flex flex-col flex-grow">
                              <div className="flex-grow">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-yellow-700 transition-colors mb-1.5 sm:mb-2 line-clamp-2">
                                  {product.name}
                                </h3>

                                {/* Dimensions */}
                                {product.dimensions && (
                                  <div className="text-xs text-gray-600 mb-3 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 inline-block">
                                    <span className="font-medium text-gray-700">
                                      {[
                                        product?.dimensions?.height?.value &&
                                          `H: ${product?.dimensions.height.value}${
                                            product.dimensions.height?.unit
                                              ?.symbol || '"'
                                          }`,
                                        product.dimensions?.width?.value &&
                                          `W: ${product.dimensions?.width?.value}${
                                            product.dimensions.width?.unit
                                              ?.symbol || '"'
                                          }`,
                                        product.dimensions?.length?.value &&
                                          `L: ${product.dimensions?.length.value}${
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
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300">
                                      {product.paintingStyle}
                                    </span>
                                  )}
                                  {product.material && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-300">
                                      {product.material.title}
                                    </span>
                                  )}
                                </div>

                                {/* View Details Button */}
                                <button className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pagination - Enhanced */}
                  {totalPages > 1 && (
                    <nav
                      className="mt-10 flex justify-center"
                      aria-label="Pagination"
                    >
                      <div className="flex items-center gap-2 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200 p-2">
                        <button
                          onClick={() =>
                            paginate(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Page Numbers - Responsive */}
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
                                      ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg"
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryDetailPage;
