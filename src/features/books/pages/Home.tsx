import { Link } from "react-router";
import { BookOpen, Star, Clock, ChevronRight, Upload, ShieldAlert, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { bookApi, API_URL } from "../../../lib/api";
import { SecureImage } from "@/components/SecureImage";
export function Home() {
  const role = localStorage.getItem('userRole') || 'user';
  const userName = localStorage.getItem('userName') || 'User';
  const [trending, setTrending] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [recentRes, trendingRes] = await Promise.all([
          bookApi.getBooks({ size: 5, sort: 'createdAt,desc' }),
          bookApi.searchBooks({ sortBy: 'popular', size: 5 })
        ]);
        setRecent(recentRes.data.data.content || []);
        setTrending(trendingRes.data.data.content || []);
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);
  return (
    <div className="pb-12">
      <section className="bg-[#00502D] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C20,0 50,0 100,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">Welcome back, {userName}</h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
              Access thousands of engineering textbooks, research papers, design manuals, and more in our comprehensive digital library.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="bg-white text-[#00502D] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                <BookOpen size={20} />
                Browse Catalog
              </Link>
              {role === 'admin' && (
                <Link to="/admin" className="bg-green-700 border border-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                  <Users size={20} /> Manage Users
                </Link>
              )}
              {role === 'moderator' && (
                <Link to="/admin" className="bg-green-700 border border-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                  <ShieldAlert size={20} /> Moderation Queue
                </Link>
              )}
              {role === 'uploader' && (
                <Link to="/admin" className="bg-green-700 border border-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                  <Upload size={20} /> Upload Content
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="text-yellow-500" fill="currentColor" /> Trending Books
          </h2>
          <Link to="/browse?sortBy=popular" className="text-[#00502D] font-medium hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? <p className="text-gray-500">Loading...</p> : <BookGrid items={trending} />}
      </section>
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="text-blue-500" /> Recently Added
          </h2>
          <Link to="/browse?sortBy=recent" className="text-[#00502D] font-medium hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? <p className="text-gray-500">Loading...</p> : <BookGrid items={recent} />}
      </section>
    </div>
  );
}
function BookGrid({ items }: { items: any[] }) {
  if (!items || items.length === 0) return <p className="text-gray-500">No books found.</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {items.map((book, i) => (
        <Link to={`/book/${book.id}`} key={i} className="group flex flex-col">
          <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
            {book.thumbnailPath ? (
              <SecureImage src={`/books/${book.id}/thumbnail`} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full bg-[#00502D]/10 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
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
  );
}
