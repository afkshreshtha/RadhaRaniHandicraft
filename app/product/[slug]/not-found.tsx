// app/product/not-found.tsx
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 flex items-center justify-center">
            <span className="text-6xl">🕉️</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4">
          Product Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          The sacred artifact you're looking for doesn't exist or may have been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <button className="px-8 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Browse All Products
            </button>
          </Link>
          
          <Link href="/">
            <button className="px-8 py-3 text-sm font-semibold rounded-xl text-amber-900 bg-white border-2 border-amber-300 hover:bg-amber-50 transition-all shadow-sm hover:shadow-md">
              Go to Home
            </button>
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-white rounded-2xl border-2 border-amber-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            What you can do:
          </h3>
          <ul className="text-left text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              Check the URL for any typos or errors
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              Use the search bar to find what you're looking for
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              Browse our full collection of handcrafted deities
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              Contact us if you need help finding a specific product
            </li>
          </ul>
        </div>

        {/* Contact Link */}

      </div>
    </div>
  );
}
