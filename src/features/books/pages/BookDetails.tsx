import { useParams, Link } from "react-router";
import { Star, BookOpen, Bookmark, MessageSquare, Flag, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import { ReviewList } from "../components/ReviewList";
import { CommentList } from "../components/CommentList";

export function BookDetails() {
  const { id } = useParams();
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'discussion'>('reviews');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00502D] mb-6">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Cover */}
          <div className="w-full md:w-1/3 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
            <div className="aspect-[2/3] w-full max-w-[240px] bg-gradient-to-br from-[#00502D] to-green-900 rounded-lg shadow-xl flex items-center justify-center text-white text-center p-4">
              <span className="font-bold text-2xl">Book Title {id}</span>
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 p-8 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 bg-green-50 text-[#00502D] text-xs font-semibold rounded uppercase tracking-wider">Structural</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wider">2023</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Structural Analysis & Design</h1>
                <p className="text-xl text-gray-600">by Engineering Dept.</p>
              </div>
              <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star fill="currentColor" size={20} />
                  <span className="font-bold text-xl text-gray-900">4.8</span>
                </div>
                <span className="text-xs text-gray-500">124 reviews</span>
              </div>
            </div>

            <p className="text-gray-600 mt-6 leading-relaxed flex-1">
              This comprehensive volume provides an in-depth analysis of modern structural design approaches within the civil engineering context. Covering load distribution, material strength, and building codes, this book is an essential read for anyone looking to understand contemporary construction methods. The document is officially released by the engineering council.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={`/read/${id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00502D] text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-sm">
                <BookOpen size={20} /> Read Now
              </Link>
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold border transition-colors ${bookmarked ? 'bg-green-50 text-[#00502D] border-green-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} /> 
                {bookmarked ? 'Saved' : 'Bookmark'}
              </button>
              <button className="p-3 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 border border-transparent transition-colors ml-auto group relative">
                <Flag size={20} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Report Content</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Discussion Section */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex gap-6 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold text-lg flex items-center gap-2 transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-[#00502D] text-[#00502D]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Star size={20} className={activeTab === 'reviews' ? 'text-yellow-500 fill-current' : ''} /> 
            Reviews
          </button>
          <button 
            onClick={() => setActiveTab('discussion')}
            className={`pb-3 font-bold text-lg flex items-center gap-2 transition-colors ${activeTab === 'discussion' ? 'border-b-2 border-[#00502D] text-[#00502D]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <MessageSquare size={20} /> 
            Discussion
          </button>
        </div>

        {activeTab === 'reviews' ? (
          <div>
            {/* Add Review */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className="text-gray-300 hover:text-yellow-400 focus:outline-none">
                      <Star size={20} />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">Rate this book</span>
              </div>
              <textarea 
                placeholder="Write your review..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#00502D] min-h-[80px] resize-y"
              ></textarea>
              <div className="mt-3 flex justify-end">
                <button className="bg-[#00502D] text-white px-5 py-1.5 text-sm rounded-lg font-medium hover:bg-green-800">
                  Post Review
                </button>
              </div>
            </div>

            {/* Review List */}
            <ReviewList />
          </div>
        ) : (
          <div>
            {/* Add Comment */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
              <textarea 
                placeholder="Join the discussion..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#00502D] min-h-[80px] resize-y mb-3"
              ></textarea>
              <div className="flex justify-end">
                <button className="bg-[#00502D] text-white px-5 py-1.5 text-sm rounded-lg font-medium hover:bg-green-800">
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comment List */}
            <CommentList />
          </div>
        )}
      </div>
    </div>
  );
}


