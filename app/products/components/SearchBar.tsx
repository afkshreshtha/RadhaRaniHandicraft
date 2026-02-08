// components/SearchBar.tsx
"use client";

import { memo, useState, useEffect } from "react";

const SearchBar = memo(({ value, onChange, isPending }) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className={`h-5 w-5 ${isPending ? 'text-amber-400 animate-pulse' : 'text-amber-500'}`}
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
          type="search"
          placeholder="Search for deities, materials, or styles..."
          className="block w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-amber-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm sm:text-base"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          aria-label="Search products"
        />
      </div>
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
