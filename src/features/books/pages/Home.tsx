import { Link } from "react-router";
import { BookOpen, Star, Clock, ChevronRight, Upload, ShieldAlert, Users } from "lucide-react";

export function Home() {
  const role = localStorage.getItem('userRole') || 'user';
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <div className="pb-12">
      {/* Hero Section */}
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

      {/* Categories / Highlights */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="text-yellow-500" fill="currentColor" /> Trending Books
          </h2>
          <Link to="/browse?filter=trending" className="text-[#00502D] font-medium hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <BookGrid items={mockTrending} />
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="text-blue-500" /> Recently Added
          </h2>
          <Link to="/browse?filter=recent" className="text-[#00502D] font-medium hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <BookGrid items={mockRecent} />
      </section>
    </div>
  );
}

function BookGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {items.map((book, i) => (
        <Link to={`/book/${book.id}`} key={i} className="group flex flex-col">
          <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full bg-[#00502D]/10 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
                {book.title}
              </div>
            )}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-800 flex items-center gap-1">
              <Star size={12} className="text-yellow-500" fill="currentColor" />
              {book.rating.toFixed(1)}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-500 truncate">{book.author}</p>
        </Link>
      ))}
    </div>
  );
}

const mockTrending = [
  { id: 1, title: "Structural Analysis & Design", author: "Dr. Ahmed", rating: 4.8, coverUrl: "" },
  { id: 2, title: "Geotechnical Engineering Principles", author: "Prof. Youssef", rating: 4.5, coverUrl: "" },
  { id: 3, title: "Concrete Technology", author: "Civil Dept.", rating: 4.9, coverUrl: "" },
  { id: 4, title: "Transportation & Highway Engineering", author: "Ministry of Public Works", rating: 4.2, coverUrl: "" },
  { id: 5, title: "Fluid Mechanics & Hydraulics", author: "Prof. Kamel", rating: 5.0, coverUrl: "" },
];

const mockRecent = [
  { id: 6, title: "Advanced Foundation Design", author: "Structural Institute", rating: 4.1, coverUrl: "" },
  { id: 7, title: "Sustainable Construction Materials", author: "Dr. Sarah", rating: 4.4, coverUrl: "" },
  { id: 8, title: "Urban Planning Guidelines", author: "Urban Development Dept.", rating: 4.7, coverUrl: "" },
  { id: 9, title: "Water Resources Management", author: "Water Authority", rating: 4.3, coverUrl: "" },
  { id: 10, title: "Steel Structures Handbook", author: "Engineering Council", rating: 4.6, coverUrl: "" },
];
