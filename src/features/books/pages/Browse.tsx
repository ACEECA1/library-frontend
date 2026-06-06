import { useState } from "react";
import { Link } from "react-router";
import { Filter, Star, Search, SlidersHorizontal } from "lucide-react";

export function Browse() {
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4">
          <div className="flex items-center gap-2 mb-6 font-bold text-lg border-b pb-4">
            <SlidersHorizontal size={20} /> Filters
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {["Structural", "Geotechnical", "Transportation", "Water Resources", "Construction"].map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#00502D] focus:ring-[#00502D]" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input type="radio" name="rating" className="text-[#00502D] focus:ring-[#00502D]" />
                    <div className="flex items-center gap-1">
                      {Array(rating).fill(0).map((_, i) => <Star key={i} size={14} className="text-yellow-500" fill="currentColor" />)}
                      <span className="text-sm">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Catalog</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D]"
              />
            </div>
            <select className="border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-[#00502D] bg-white">
              <option>Newest First</option>
              <option>Highest Rated</option>
              <option>Most Viewed</option>
              <option>A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => (
            <Link to={`/book/${i+1}`} key={i} className="group flex flex-col">
              <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-green-900/10 to-[#00502D]/20 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
                  Book Title {i+1}
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-800 flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" fill="currentColor" />
                  {(4 + Math.random()).toFixed(1)}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">Book Title {i+1}</h3>
              <p className="text-sm text-gray-500 truncate">Author Name</p>
              <p className="text-xs text-gray-400 mt-1">Category</p>
            </Link>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-12 gap-2">
          <button className="px-4 py-2 border rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <button className="px-4 py-2 bg-[#00502D] text-white rounded">1</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-50">2</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-50">3</button>
          <button className="px-4 py-2 border rounded text-gray-500 hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}
