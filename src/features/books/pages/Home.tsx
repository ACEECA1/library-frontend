import { Link } from "react-router";
import { BookOpen, Star, Clock, ChevronRight, Upload, ShieldAlert, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { bookApi, API_URL } from "../../../lib/api";
import { BookCard } from "../components/BookCard";
export function Home() {
  const { t } = useTranslation();
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">{t('home.welcomeBack', { name: userName })}</h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
              {t('home.heroText')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="bg-white text-[#00502D] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                <BookOpen size={20} />
                {t('home.browseCatalog')}
              </Link>
              {role === 'admin' && (
                <Link to="/admin" className="bg-green-700 border border-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                  <Users size={20} /> {t('home.manageUsers')}
                </Link>
              )}
              {role === 'moderator' && (
                <Link to="/admin" className="bg-green-700 border border-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                  <ShieldAlert size={20} /> {t('home.moderationQueue')}
                </Link>
              )}
              {role === 'uploader' && (
                <Link to="/admin" className="bg-green-700 border border-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                  <Upload size={20} /> {t('home.uploadContent')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="text-yellow-500" fill="currentColor" /> {t('home.trendingBooks')}
          </h2>
          <Link to="/browse?sortBy=popular" className="text-[#00502D] font-medium hover:underline flex items-center">
            {t('home.viewAll')} <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? <p className="text-gray-500">{t('home.loading')}</p> : <BookGrid items={trending} onUpdate={(updated) => setTrending(trending.map(b => b.id === updated.id ? updated : b))} />}
      </section>
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="text-blue-500" /> {t('home.recentlyAdded')}
          </h2>
          <Link to="/browse?sortBy=recent" className="text-[#00502D] font-medium hover:underline flex items-center">
            {t('home.viewAll')} <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? <p className="text-gray-500">{t('home.loading')}</p> : <BookGrid items={recent} onUpdate={(updated) => setRecent(recent.map(b => b.id === updated.id ? updated : b))} />}
      </section>
    </div>
  );
}
function BookGrid({ items, onUpdate }: { items: any[], onUpdate?: (updated: any) => void }) {
  const { t } = useTranslation();
  if (!items || items.length === 0) return <p className="text-gray-500">{t('home.noBooksFound')}</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {items.map((book, i) => (
        <BookCard 
          key={book.id || i} 
          book={book} 
          onBookUpdated={onUpdate}
        />
      ))}
    </div>
  );
}
