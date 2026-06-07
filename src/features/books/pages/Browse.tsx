import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Filter, Star, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { metadataApi, bookApi } from "../../../lib/api";
import { SecureImage } from "@/components/SecureImage";
export function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryQ = searchParams.get("q") || "";
  const querySortBy = searchParams.get("sortBy") || "createdAt";
  const queryCategory = searchParams.get("category") || "";
  const queryPage = parseInt(searchParams.get("page") || "0", 10);
  const [search, setSearch] = useState(queryQ);
  const [books, setBooks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    metadataApi.getCategories()
      .then(res => setCategories(res.data.data || []))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await bookApi.searchBooks({
          q: queryQ,
          category: queryCategory,
          sortBy: querySortBy,
          page: queryPage,
          size: 12
        });
        setBooks(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [queryQ, queryCategory, querySortBy, queryPage]);
  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.delete('page');
    setSearchParams(newParams);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", search);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4">
          <div className="flex items-center gap-2 mb-6 font-bold text-lg border-b pb-4">
            <SlidersHorizontal size={20} /> Filters
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category"
                    checked={queryCategory === ""}
                    onChange={() => updateParam("category", "")}
                    className="rounded text-[#00502D] focus:ring-[#00502D]" 
                  />
                  All Categories
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category"
                      checked={queryCategory === cat.name}
                      onChange={() => updateParam("category", cat.name)}
                      className="rounded text-[#00502D] focus:ring-[#00502D]" 
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Catalog</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D]"
              />
            </form>
            <select 
              value={querySortBy}
              onChange={(e) => updateParam("sortBy", e.target.value)}
              className="border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-[#00502D] bg-white"
            >
              <option value="createdAt">Newest First</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500">No books found matching your criteria.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <Link to={`/book/${book.id}`} key={book.id} className="group flex flex-col">
                  <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
                    {book.thumbnailPath ? (
                      <SecureImage src={`/books/${book.id}/thumbnail`} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-900/10 to-[#00502D]/20 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
                        {book.title}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-800 flex items-center gap-1">
                      <Star size={12} className="text-yellow-500" fill="currentColor" />
                      {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{book.author}</p>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button 
                  onClick={() => updateParam("page", String(queryPage - 1))}
                  disabled={queryPage === 0}
                  className="px-3 py-2 border rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-2 text-sm font-medium">Page {queryPage + 1} of {totalPages}</span>
                <button 
                  onClick={() => updateParam("page", String(queryPage + 1))}
                  disabled={queryPage >= totalPages - 1}
                  className="px-3 py-2 border rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
