// components/ProductGrid.tsx
"use client";

import { memo } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = memo(({
  currentProducts,
  filteredProducts,
  indexOfFirstProduct,
  indexOfLastProduct,
  sortOption,
  sortOptions,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  resetFilters,
  isPending,
}) => {
  return (
    <>
      {/* Results Count and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-xl border-2 border-amber-100 shadow-sm">
        <p className="text-gray-700 font-medium">
          Showing{" "}
          <span className="text-yellow-700 font-bold">
            {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0}-
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
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full pl-4 pr-10 py-2.5 text-sm border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-lg bg-amber-50 font-medium text-gray-700 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid or Empty State */}
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
          {/* Product Grid */}
          <div 
            className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 ${
              isPending ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav
                className="isolate inline-flex -space-x-px rounded-xl shadow-lg overflow-hidden border-2 border-amber-200"
                aria-label="Pagination"
              >
                {/* Previous Button */}
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 text-gray-700 bg-white hover:bg-amber-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                  aria-label="Previous page"
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

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => onPageChange(number)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-bold transition-all ${
                        currentPage === number
                          ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white z-10 shadow-lg"
                          : "text-gray-700 bg-white hover:bg-amber-50"
                      }`}
                      aria-label={`Page ${number}`}
                      aria-current={currentPage === number ? "page" : undefined}
                    >
                      {number}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 text-gray-700 bg-white hover:bg-amber-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                  aria-label="Next page"
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
    </>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
