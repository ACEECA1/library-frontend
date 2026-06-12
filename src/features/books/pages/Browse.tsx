import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Filter, Star, Search, SlidersHorizontal, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { metadataApi, bookApi } from "../../../lib/api";
import { BookCard } from "../components/BookCard";

export function Browse() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryQ = searchParams.get("q") || "";
  const querySortBy = searchParams.get("sortBy") || "createdAt";
  const queryCategory = searchParams.get("category") || "";
  const queryTag = searchParams.get("tag") || "";
  const querySeries = searchParams.get("series") || "";
  const queryPage = parseInt(searchParams.get("page") || "0", 10);
  
  const [search, setSearch] = useState(queryQ);
  const [books, setBooks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      metadataApi.getCategories().then(res => setCategories(res.data.data || [])).catch(() => {}),
      metadataApi.getTags().then(res => setTags(res.data.data || [])).catch(() => {}),
      metadataApi.getSeries().then(res => setSeriesList(res.data.data || [])).catch(() => {})
    ]);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const hasSearchFilters = queryQ || queryCategory || queryTag || querySeries || querySortBy !== "createdAt";
        const res = hasSearchFilters 
          ? await bookApi.searchBooks({
              q: queryQ,
              category: queryCategory,
              tag: queryTag,
              series: querySeries,
              sortBy: querySortBy,
              page: queryPage,
              size: 12
            })
          : await bookApi.getBooks({ page: queryPage, size: 12, sort: 'createdAt,desc' });
        setBooks(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [queryQ, queryCategory, queryTag, querySeries, querySortBy, queryPage]);

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

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className={`w-full md:w-72 shrink-0 ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
              <SlidersHorizontal size={20} className="text-[#00502D]" /> {t('browse.filters')}
            </div>
            {(queryCategory || queryTag || querySeries || queryQ || querySortBy !== "createdAt") && (
              <button onClick={clearFilters} className="text-xs text-[#00502D] font-semibold hover:underline">{t('browse.clearAll')}</button>
            )}
          </div>
          <div className="space-y-6">
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{t('browse.categories')}</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#00502D] transition-colors text-sm">
                  <input 
                    type="radio" 
                    name="category"
                    checked={queryCategory === ""}
                    onChange={() => updateParam("category", "")}
                    className="rounded-full w-4 h-4 text-[#00502D] focus:ring-[#00502D] border-gray-300" 
                  />
                  {t('browse.allCategories')}
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#00502D] transition-colors text-sm">
                    <input 
                      type="radio" 
                      name="category"
                      checked={queryCategory === cat.name}
                      onChange={() => updateParam("category", cat.name)}
                      className="rounded-full w-4 h-4 text-[#00502D] focus:ring-[#00502D] border-gray-300" 
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{t('browse.tags')}</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => updateParam("tag", "")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${queryTag === "" ? 'bg-[#00502D] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {t('browse.all')}
                </button>
                {tags.map(tag => (
                  <button 
                    key={tag.id}
                    onClick={() => updateParam("tag", tag.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${queryTag === tag.name ? 'bg-[#00502D] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

            {seriesList.length > 0 && (
              <>
                <div className="h-px bg-gray-100"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{t('browse.series')}</h3>
                  <select 
                    value={querySeries}
                    onChange={(e) => updateParam("series", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D] bg-white text-gray-700"
                  >
                    <option value="">{t('browse.anySeries')}</option>
                    {seriesList.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-[#00502D]">
                <BookOpen size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('browse.catalog')}</h1>
            </div>
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="md:hidden flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Filter size={18} />
            </button>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={t('browse.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D] transition-shadow"
              />
            </form>
            <select 
              value={querySortBy}
              onChange={(e) => updateParam("sortBy", e.target.value)}
              className="border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D] bg-white text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="createdAt">{t('browse.newestFirst')}</option>
              <option value="views">{t('browse.mostViewed')}</option>
              <option value="rating">{t('browse.highestRated')}</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#00502D] rounded-full animate-spin mb-4"></div>
            <p>{t('browse.loadingLibrary')}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 text-center px-4">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('browse.noBooksFound')}</h3>
            <p className="text-gray-500 max-w-md">{t('browse.noBooksDesc')}</p>
            <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-[#00502D] text-white rounded-lg font-medium hover:bg-[#003a20] transition-colors shadow-sm">
              {t('browse.clearFilters')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBookDeleted={(id) => setBooks(books.filter(b => b.id !== id))}
                  onBookUpdated={(updated) => setBooks(books.map(b => b.id === updated.id ? updated : b))}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button 
                  onClick={() => updateParam("page", String(queryPage - 1))}
                  disabled={queryPage === 0}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm flex items-center">
                  {t('browse.pageOf', { current: queryPage + 1, total: totalPages })}
                </div>
                <button 
                  onClick={() => updateParam("page", String(queryPage + 1))}
                  disabled={queryPage >= totalPages - 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
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
