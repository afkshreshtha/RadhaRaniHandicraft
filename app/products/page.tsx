"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { client } from "@/sanity.cli";
import imageUrlBuilder from "@sanity/image-url";
import { getAllProductsQuery } from "@/lib/queries";
import { formatDimensions } from "@/lib/formatDimensions";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPaintingStyles, setSelectedPaintingStyles] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOption, setSortOption] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const builder = imageUrlBuilder(client);

  function urlFor(source) {
    return builder.image(source);
  }

  // Mobile filter state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Predefined painting styles
  const paintingStyles = ["Full Paint", "Half Paint"];

  // Sort options
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  // Fetch products, categories, and materials on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await client.fetch(`*[_type == "category"] {
          _id,
          title
        }`);
        setCategories(categoriesData);

        // Fetch materials
        const materialsData = await client.fetch(`*[_type == "Material"] {
          _id,
          title
        }`);
        setMaterials(materialsData);

        // Fetch products with referenced data
        const productsData = await client.fetch(getAllProductsQuery);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle handlers for filters
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const toggleMaterial = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
    setCurrentPage(1);
  };

  const togglePaintingStyle = (style) => {
    setSelectedPaintingStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
    setCurrentPage(1);
  };

  const selectPriceRange = (range) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedPaintingStyles([]);
    setPriceRange([0, 50000]);
    setSortOption("newest");
    setCurrentPage(1);
  };

  // Handle body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];

    let result = products.filter((product) => {
      // Search filter
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.category && selectedCategories.includes(product.category._id));

      // Material filter
      const matchesMaterial =
        selectedMaterials.length === 0 ||
        (product.material && selectedMaterials.includes(product.material._id));

      // Painting style filter
      const matchesPaintingStyle =
        selectedPaintingStyles.length === 0 ||
        selectedPaintingStyles.includes(product.paintingStyle);

      // Price filter
      const productPrice = parseFloat(product.price);
      const matchesPrice =
        productPrice >= priceRange[0] &&
        (priceRange[1] === 50000 ? true : productPrice <= priceRange[1]);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMaterial &&
        matchesPaintingStyle &&
        matchesPrice
      );
    });

    // Sorting logic
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => {
          const priceA = parseFloat(a.actual_price || a.price);
          const priceB = parseFloat(b.actual_price || b.price);
          return priceA - priceB;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const priceA = parseFloat(a.actual_price || a.price);
          const priceB = parseFloat(b.actual_price || b.price);
          return priceB - priceA;
        });
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "featured":
        result = result.filter((item) => item.featured === true);
        break;
    }

    return result;
  }, [
    products,
    search,
    selectedCategories,
    selectedMaterials,
    selectedPaintingStyles,
    priceRange,
    sortOption,
  ]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate discount percentage
  const calculateDiscount = (actualPrice, sellingPrice) => {
    if (!actualPrice || !sellingPrice) return 0;
    const discount = ((actualPrice - sellingPrice) / actualPrice) * 100;
    return Math.round(discount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        {/* Enhanced marble-themed loading animation */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-spin border-t-yellow-600 shadow-lg"></div>
          <div className="absolute inset-4 rounded-full border-4 border-yellow-100 animate-spin border-b-amber-600 animation-delay-150"></div>
          <div className="absolute inset-8 rounded-full border-4 border-amber-100 animate-spin border-r-yellow-500 animation-delay-300"></div>
          <div className="absolute inset-12 rounded-full border-4 border-yellow-50 animate-spin border-l-amber-500 animation-delay-500"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
          Loading Sacred Collection
        </h2>
        <p className="text-gray-600">Carving divine perfection for you...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-3">
            Sacred Artisan Collection
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover handcrafted spiritual artifacts made with devotion and
            precision
          </p>
        </div>

        {/* Enhanced Search bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for deities, materials, or styles..."
              className="block w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-amber-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm sm:text-base"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            className="inline-flex items-center px-5 py-3 border-2 border-amber-300 rounded-xl shadow-sm text-sm font-medium text-amber-900 bg-white hover:bg-amber-50 transition-all w-full sm:w-auto justify-center"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" />
            </svg>
            Filters & Sort
          </button>
        </div>

        {/* Mobile filters drawer with enhanced styling */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
            mobileFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className={`fixed inset-y-0 left-0 w-full sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
              mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-4 flex items-center justify-between shadow-lg z-10">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Categories filter */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                    Categories
                  </h3>
                  <div className="space-y-2.5">
                    {categories.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => toggleCategory(category._id)}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                          {category.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Materials filter */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                    Materials
                  </h3>
                  <div className="space-y-2.5">
                    {materials.map((material) => (
                      <label
                        key={material._id}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(material._id)}
                          onChange={() => toggleMaterial(material._id)}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                          {material.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Painting style filter */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                    Painting Style
                  </h3>
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

                {/* Price range filter */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                    Price Range
                  </h3>
                  <div className="px-2">
                    <Slider
                      range
                      min={0}
                      max={50000}
                      step={1000}
                      value={priceRange}
                      onChange={(value) => {
                        setPriceRange(value);
                        setCurrentPage(1);
                      }}
                      trackStyle={[{ backgroundColor: "#d97706", height: 6 }]}
                      handleStyle={[
                        {
                          backgroundColor: "#d97706",
                          borderColor: "#d97706",
                          width: 20,
                          height: 20,
                          marginTop: -7,
                        },
                        {
                          backgroundColor: "#d97706",
                          borderColor: "#d97706",
                          width: 20,
                          height: 20,
                          marginTop: -7,
                        },
                      ]}
                      railStyle={{ backgroundColor: "#fed7aa", height: 6 }}
                    />
                    <div className="flex justify-between mt-4 text-sm font-medium text-gray-700">
                      <span className="bg-white px-3 py-1 rounded-lg border border-amber-200">
                        ₹{priceRange[0].toLocaleString("en-IN")}
                      </span>
                      <span className="bg-white px-3 py-1 rounded-lg border border-amber-200">
                        {priceRange[1] === 50000
                          ? "₹50,000+"
                          : `₹${priceRange[1].toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3 pt-4 sticky bottom-0 bg-white pb-4">
                  <button
                    onClick={() => {
                      resetFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full py-3 px-4 border-2 border-amber-300 text-sm font-semibold rounded-xl text-amber-900 bg-white hover:bg-amber-50 transition-all"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg"
                  >
                    Apply Filters ({filteredProducts.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Enhanced Filters sidebar - Desktop */}
          <div className="hidden lg:block w-72 xl:w-80 space-y-5">
            {/* Categories filter */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-amber-100 hover:border-amber-200 transition-all">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-base">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => toggleCategory(category._id)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                      {category.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Materials filter */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-amber-100 hover:border-amber-200 transition-all">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-base">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                Materials
              </h3>
              <div className="space-y-3">
                {materials.map((material) => (
                  <label
                    key={material._id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material._id)}
                      onChange={() => toggleMaterial(material._id)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                      {material.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Painting style filter */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-amber-100 hover:border-amber-200 transition-all">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-base">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                Painting Style
              </h3>
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
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                      {style}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-amber-100 hover:border-amber-200 transition-all">
              <h3 className="font-semibold text-gray-900 mb-5 flex items-center text-base">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                Price Range
              </h3>
              <div className="px-2">
                <Slider
                  range
                  min={0}
                  max={50000}
                  step={1000}
                  value={priceRange}
                  onChange={(value) => {
                    setPriceRange(value);
                    setCurrentPage(1);
                  }}
                  trackStyle={[{ backgroundColor: "#d97706", height: 6 }]}
                  handleStyle={[
                    {
                      backgroundColor: "#d97706",
                      borderColor: "#d97706",
                      width: 20,
                      height: 20,
                      marginTop: -7,
                      boxShadow: "0 2px 8px rgba(217, 119, 6, 0.3)",
                    },
                    {
                      backgroundColor: "#d97706",
                      borderColor: "#d97706",
                      width: 20,
                      height: 20,
                      marginTop: -7,
                      boxShadow: "0 2px 8px rgba(217, 119, 6, 0.3)",
                    },
                  ]}
                  railStyle={{ backgroundColor: "#fed7aa", height: 6 }}
                />
                <div className="flex justify-between mt-5 text-sm font-medium text-gray-700">
                  <span className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    ₹{priceRange[0].toLocaleString("en-IN")}
                  </span>
                  <span className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    {priceRange[1] === 50000
                      ? "₹50,000+"
                      : `₹${priceRange[1].toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-3 px-4 border-2 border-amber-300 text-sm font-semibold rounded-xl text-amber-900 bg-white hover:bg-amber-50 transition-all shadow-sm hover:shadow-md"
            >
              Reset All Filters
            </button>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            {/* Enhanced Results count and sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-xl border-2 border-amber-100 shadow-sm">
              <p className="text-gray-700 font-medium">
                Showing{" "}
                <span className="text-yellow-700 font-bold">
                  {indexOfFirstProduct + 1}-
                  {Math.min(indexOfLastProduct, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="text-yellow-700 font-bold">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              <div className="relative w-full sm:w-56">
                <label htmlFor="sort" className="sr-only">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="block w-full pl-4 pr-10 py-2.5 text-sm border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-lg bg-amber-50 font-medium text-gray-700"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-amber-200">
                <svg
                  className="mx-auto h-16 w-16 text-amber-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-6 py-3 border-2 border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
      
                {/* ENHANCED PRODUCT GRID - MOBILE OPTIMIZED */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                  {currentProducts.map((product) => {
                    const dimensions = product?.dimensions;
                    const actualPrice = product?.actual_price
                      ? parseFloat(product.actual_price)
                      : null;
                    const sellingPrice = parseFloat(product.price);
                    const discountPercentage = actualPrice
                      ? calculateDiscount(actualPrice, sellingPrice)
                      : 0;

                    return (
                      <div
                        key={product._id}
                        className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-amber-100 hover:border-amber-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
                      >
                        {/* Product Image Container - MOBILE OPTIMIZED */}
                        <Link href={`/product/${product.slug.current}`}>
                          <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={urlFor(product.images[0]).url()}
                                alt={product.name}
                                fill
                                className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                priority={false}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-gray-400 text-xs">
                                  No image
                                </span>
                              </div>
                            )}

                            {/* Badges Container - MOBILE OPTIMIZED */}
                            <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-3 sm:left-3 sm:right-3 flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-2">
                              {/* Discount Badge */}
                              {discountPercentage > 0 && (
                                <span className="inline-flex items-center px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg">
                                  {discountPercentage}% OFF
                                </span>
                              )}

                              {/* Featured Badge */}
                              {product.featured && (
                                <span className="inline-flex items-center px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg">
                                  ⭐
                                </span>
                              )}
                            </div>

                            {/* Quick View Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                        </Link>

                        {/* Product Details - MOBILE OPTIMIZED */}
                        <div className="p-2.5 sm:p-4 lg:p-5 flex flex-col flex-grow">
                          <div className="flex-grow">
                            <Link href={`/product/${product.slug.current}`}>
                              <h3 className="text-xs sm:text-base lg:text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-yellow-700 transition-colors leading-tight">
                                {product.name}
                              </h3>
                            </Link>

                            <Link
                              href={`/category/${product.category?.slug.current}`}
                            >
                              <p className="text-[10px] sm:text-xs lg:text-sm text-amber-700 font-medium mb-1.5 sm:mb-2 hover:text-amber-800 transition-colors">
                                {product.category?.title}
                              </p>
                            </Link>

                            {/* Dimensions - HIDE ON MOBILE */}
                            {dimensions && (
                              <div className="hidden sm:block text-xs text-gray-600 mb-3 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 inline-block">
                                <span className="font-medium text-gray-700">
                                  {[
                                    dimensions.height?.value &&
                                      `H: ${dimensions.height.value}${dimensions.height?.unit?.symbol || '"'}`,
                                    dimensions.width?.value &&
                                      `W: ${dimensions.width.value}${dimensions.width?.unit?.symbol || '"'}`,
                                    dimensions.length?.value &&
                                      `L: ${dimensions.length.value}${dimensions.length?.unit?.symbol || '"'}`,
                                  ]
                                    .filter(Boolean)
                                    .join(" × ")}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Price Section - MOBILE OPTIMIZED */}
                          <div className="mt-2 sm:mt-4 space-y-1.5 sm:space-y-3">
                            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                              <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900">
                                ₹{sellingPrice.toLocaleString("en-IN")}
                              </p>
                              {actualPrice && actualPrice > sellingPrice && (
                                <p className="text-[10px] sm:text-sm text-gray-500 line-through">
                                  ₹{actualPrice.toLocaleString("en-IN")}
                                </p>
                              )}
                            </div>

                            {/* Tags - MOBILE OPTIMIZED */}
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300">
                                {product.paintingStyle}
                              </span>
                              {product.material && (
                                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-300">
                                  {product.material.title}
                                </span>
                              )}
                            </div>

                            {/* View Details Button - MOBILE OPTIMIZED */}
                            <button className="w-full py-1.5 sm:py-2.5 px-2 sm:px-4 text-[10px] sm:text-sm font-semibold rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <nav
                      className="isolate inline-flex -space-x-px rounded-xl shadow-lg overflow-hidden border-2 border-amber-200"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 text-gray-700 bg-white hover:bg-amber-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-bold transition-all ${
                              currentPage === number
                                ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white z-10 shadow-lg"
                                : "text-gray-700 bg-white hover:bg-amber-50"
                            }`}
                          >
                            {number}
                          </button>
                        )
                      )}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-3 py-2 text-gray-700 bg-white hover:bg-amber-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
