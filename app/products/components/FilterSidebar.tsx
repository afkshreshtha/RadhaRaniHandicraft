// components/FilterSidebar.tsx
"use client";

import { memo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FilterSidebar = memo(({
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
}) => {
  return (
    <div className="space-y-5">
      {/* Categories Filter */}
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
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                {category.title}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Materials Filter */}
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
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                {material.title}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Painting Style Filter */}
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
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-yellow-700 transition-colors">
                {style}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
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
            onChange={handlePriceChange}
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

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full py-3 px-4 border-2 border-amber-300 text-sm font-semibold rounded-xl text-amber-900 bg-white hover:bg-amber-50 transition-all shadow-sm hover:shadow-md"
      >
        Reset All Filters
      </button>
    </div>
  );
});

FilterSidebar.displayName = "FilterSidebar";

export default FilterSidebar;
