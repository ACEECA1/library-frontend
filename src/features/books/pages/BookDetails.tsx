import { useParams, Link } from "react-router";
import { Star, BookOpen, Bookmark, MessageSquare, Flag, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

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
            <div className="space-y-4">
              <ReviewItem name="Engineer Kamel" date="2 days ago" rating={5} text="Excellent manual. The section on load distribution is particularly well-detailed and aligns perfectly with current building codes." badge="Top Reviewer" />
              <ReviewItem name="Prof. Ahmed" date="1 week ago" rating={4} text="Good overview but could use more recent case studies. Overall a solid resource." />
            </div>
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
            <div className="space-y-4">
              <CommentItem name="Student Ali" date="3 hours ago" text="Does anyone know if this covers the 2024 updates to the seismic design guidelines?" upvotes={12} downvotes={2} />
              <CommentItem name="Eng. Youssef" date="1 day ago" text="Yes, it touches on them briefly in chapter 4, but for a deep dive you might want to look at the specialized geotechnical manuals." upvotes={34} downvotes={0} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewItem({ name, date, rating, text, badge }: any) {
  return (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-green-100 text-[#00502D] rounded-full flex items-center justify-center font-bold shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900">{name}</h4>
            {badge && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded uppercase">{badge}</span>}
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <div className="flex items-center gap-1 mb-2 text-yellow-500">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i >= rating ? "text-gray-300" : ""} />
          ))}
        </div>
        <p className="text-gray-700 text-sm">{text}</p>
        <div className="mt-3 flex justify-end text-xs text-gray-500">
          <button className="hover:text-red-600 flex items-center gap-1"><Flag size={12} /> Report</button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ name, date, text, upvotes, downvotes }: any) {
  const [localUp, setLocalUp] = useState(upvotes);
  const [localDown, setLocalDown] = useState(downvotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const handleUpvote = () => {
    if (voted === "up") {
      setLocalUp(localUp - 1);
      setVoted(null);
    } else {
      setLocalUp(localUp + 1);
      if (voted === "down") setLocalDown(localDown - 1);
      setVoted("up");
    }
  };

  const handleDownvote = () => {
    if (voted === "down") {
      setLocalDown(localDown - 1);
      setVoted(null);
    } else {
      setLocalDown(localDown + 1);
      if (voted === "up") setLocalUp(localUp - 1);
      setVoted("down");
    }
  };

  return (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-gray-900">{name}</h4>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <p className="text-gray-700 text-sm mb-3">{text}</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
            <button 
              onClick={handleUpvote}
              className={`hover:text-green-600 flex items-center gap-1 ${voted === 'up' ? 'text-green-600' : 'text-gray-500'}`}
            >
              <ArrowUp size={14} /> {localUp}
            </button>
            <div className="w-px h-3 bg-gray-300"></div>
            <button 
              onClick={handleDownvote}
              className={`hover:text-red-600 flex items-center gap-1 ${voted === 'down' ? 'text-red-600' : 'text-gray-500'}`}
            >
              <ArrowDown size={14} /> {localDown}
            </button>
          </div>
          <button className="text-gray-500 hover:text-[#00502D] font-medium">Reply</button>
          <button className="hover:text-red-600 ml-auto flex items-center gap-1 text-gray-500"><Flag size={12} /> Report</button>
        </div>
      </div>
    </div>
  );
}
