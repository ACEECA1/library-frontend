import { useParams, Link, useNavigate } from "react-router";
import { Star, BookOpen, Bookmark, MessageSquare, Flag, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ReviewList } from "../components/ReviewList";
import { CommentList } from "../components/CommentList";
import { bookApi, bookmarkApi } from "../../../lib/api";
import { toast } from "sonner";
import { SecureImage } from "@/components/SecureImage";
import { ReportModal } from "../../../components/ReportModal";
export function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'discussion'>('reviews');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await bookApi.getBook(id!);
        setBook(res.data.data);
        setBookmarked(res.data.data.bookmarked || false);
      } catch (err) {
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  const handleBookmarkToggle = async () => {
    try {
      if (bookmarked) {
        if (book.userBookmarkId) {
          await bookmarkApi.deleteBookmark(book.userBookmarkId);
        }
        setBookmarked(false);
        setBook((prev: any) => ({ ...prev, bookmarked: false, userBookmarkId: undefined }));
        toast.success("Bookmark removed");
      } else {
        const res = await bookmarkApi.addBookmark(id!);
        setBookmarked(true);
        setBook((prev: any) => ({ ...prev, bookmarked: true, userBookmarkId: res.data.data.id }));
        toast.success("Bookmarked successfully");
      }
    } catch (err) {
      toast.error("Failed to update bookmark");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#00502D]" />
      </div>
    );
  }
  if (!book) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-500">
        Book not found.
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00502D] mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
            {book.thumbnailPath ? (
              <SecureImage src={`/books/${book.id}/thumbnail`} alt="cover" className="max-w-full rounded-lg shadow-xl" />
            ) : (
              <div className="aspect-[2/3] w-full max-w-[240px] bg-gradient-to-br from-[#00502D] to-green-900 rounded-lg shadow-xl flex items-center justify-center text-white text-center p-4">
                <span className="font-bold text-xl">{book.title}</span>
              </div>
            )}
          </div>
          <div className="w-full md:w-2/3 p-8 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {book.categories?.map((cat: any) => (
                    <span key={cat.id} className="px-2 py-1 bg-green-50 text-[#00502D] text-xs font-semibold rounded uppercase tracking-wider">{cat.name}</span>
                  ))}
                  {book.tags?.map((tag: any) => (
                    <span key={tag.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded uppercase tracking-wider">{tag.name}</span>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">by {book.author}</p>
                {book.series && <p className="text-sm text-purple-600 font-medium mt-1">Series: {book.series.name}</p>}
              </div>
              <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star fill="currentColor" size={20} />
                  <span className="font-bold text-xl text-gray-900">{book.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
                <span className="text-xs text-gray-500">{book.reviewCount || 0} reviews</span>
              </div>
            </div>
            <p className="text-gray-600 mt-6 leading-relaxed flex-1">
              {book.description || 'No description available for this book.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={`/read/${id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00502D] text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-sm">
                <BookOpen size={20} /> Read Now
              </Link>
              <button 
                onClick={handleBookmarkToggle}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold border transition-colors ${bookmarked ? 'bg-green-50 text-[#00502D] border-green-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} /> 
                {bookmarked ? 'Saved' : 'Bookmark'}
              </button>
              <button 
                onClick={() => setReportModalOpen(true)}
                className="p-3 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 border border-transparent transition-colors ml-auto group relative"
              >
                <Flag size={20} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Report Content</span>
              </button>
            </div>
          </div>
        </div>
      </div>
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
            <ReviewList bookId={id!} />
          </div>
        ) : (
          <div>
            <CommentList bookId={id!} />
          </div>
        )}
      </div>
      <ReportModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)} 
        targetType="BOOK" 
        targetId={book.id} 
      />
    </div>
  );
}
