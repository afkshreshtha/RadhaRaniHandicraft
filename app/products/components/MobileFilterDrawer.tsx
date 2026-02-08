// components/MobileFilterDrawer.tsx
"use client";

import { useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function MobileFilterDrawer({
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
  isOpen,
  onClose,
  filteredCount,
}) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-full sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-4 flex items-center justify-between shadow-lg z-10">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={onClose}
              aria-label="Close filters"
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

          {/* Filter Content */}
          <div className="p-4 space-y-6">
            {/* Categories */}
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
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                      {category.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Materials */}
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
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                      {material.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Painting Style */}
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
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                      {style}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
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
                  onChange={handlePriceChange}
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

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 sticky bottom-0 bg-white pb-4">
              <button
                onClick={() => {
                  resetFilters();
                  onClose();
                }}
                className="w-full py-3 px-4 border-2 border-amber-300 text-sm font-semibold rounded-xl text-amber-900 bg-white hover:bg-amber-50 transition-all"
              >
                Reset Filters
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg"
              >
                Apply Filters ({filteredCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
