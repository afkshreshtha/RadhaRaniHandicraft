"use client";

import { useState, useMemo, useCallback, useTransition, memo } from "react";
import dynamic from "next/dynamic";
import FilterSidebar from "@/app/products/components/FilterSidebar";
import ProductGrid from "@/app/products/components/ProductGrid";
import SearchBar from "@/app/products/components/SearchBar";

// Lazy load heavy components
const MobileFilterDrawer = dynamic(() => import("@/app/products/components/MobileFilterDrawer"), {
  ssr: false,
  loading: () => <div>Loading filters...</div>
});

export default function ProductsClient({ 
  initialProducts, 
  categories, 
  materials 
}) {
  // State management
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPaintingStyles, setSelectedPaintingStyles] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const paintingStyles = ["Full Paint", "Half Paint"];
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  // Optimized toggle handlers with useCallback
  const toggleCategory = useCallback((categoryId) => {
    startTransition(() => {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
      setCurrentPage(1);
    });
  }, []);

  const toggleMaterial = useCallback((materialId) => {
    startTransition(() => {
      setSelectedMaterials((prev) =>
        prev.includes(materialId)
          ? prev.filter((id) => id !== materialId)
          : [...prev, materialId]
      );
      setCurrentPage(1);
    });
  }, []);

  const togglePaintingStyle = useCallback((style) => {
    startTransition(() => {
      setSelectedPaintingStyles((prev) =>
        prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
      );
      setCurrentPage(1);
    });
  }, []);

  const handlePriceChange = useCallback((value) => {
    startTransition(() => {
      setPriceRange(value);
      setCurrentPage(1);
    });
  }, []);

  const handleSearchChange = useCallback((value) => {
    startTransition(() => {
      setSearch(value);
      setCurrentPage(1);
    });
  }, []);

  const handleSortChange = useCallback((value) => {
    startTransition(() => {
      setSortOption(value);
    });
  }, []);

  const resetFilters = useCallback(() => {
    startTransition(() => {
      setSearch("");
      setSelectedCategories([]);
      setSelectedMaterials([]);
      setSelectedPaintingStyles([]);
      setPriceRange([0, 50000]);
      setSortOption("newest");
      setCurrentPage(1);
    });
  }, []);

  // Optimized filtering with useMemo
  const filteredProducts = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];

    let result = initialProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.category && selectedCategories.includes(product.category._id));

      const matchesMaterial =
        selectedMaterials.length === 0 ||
        (product.material && selectedMaterials.includes(product.material._id));

      const matchesPaintingStyle =
        selectedPaintingStyles.length === 0 ||
        selectedPaintingStyles.includes(product.paintingStyle);

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

    // Sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
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
    initialProducts,
    search,
    selectedCategories,
    selectedMaterials,
    selectedPaintingStyles,
    priceRange,
    sortOption,
  ]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = useMemo(
    () => filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct),
    [filteredProducts, indexOfFirstProduct, indexOfLastProduct]
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filterProps = {
    categories,
    materials,
    paintingStyles,
    selectedCategories,
    selectedMaterials,
    selectedPaintingStyles,
    priceRange,
    toggleCategory,
    toggleMaterial,
    togglePaintingStyle,
    handlePriceChange,
    resetFilters,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-3">
            Sacred Artisan Collection
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover handcrafted spiritual artifacts made with devotion and precision
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          value={search} 
          onChange={handleSearchChange}
          isPending={isPending}
        />

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
            Filters & Sort ({filteredProducts.length})
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <MobileFilterDrawer
            {...filterProps}
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            filteredCount={filteredProducts.length}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 xl:w-80">
            <FilterSidebar {...filterProps} />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              currentProducts={currentProducts}
              filteredProducts={filteredProducts}
              indexOfFirstProduct={indexOfFirstProduct}
              indexOfLastProduct={indexOfLastProduct}
              sortOption={sortOption}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
              resetFilters={resetFilters}
              isPending={isPending}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
