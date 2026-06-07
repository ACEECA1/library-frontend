import { useParams, Link, useNavigate } from "react-router";
import { Star, BookOpen, Bookmark, MessageSquare, Flag, ArrowLeft, Loader2, Edit, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { ReviewList } from "../components/ReviewList";
import { CommentList } from "../components/CommentList";
import { bookApi, bookmarkApi } from "../../../lib/api";
import { toast } from "sonner";
import { SecureImage } from "@/components/SecureImage";
import { ReportModal } from "../../../components/ReportModal";
import { useAuth } from "../../../context/AuthContext";
import { EditBookModal } from "../components/EditBookModal";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

export function BookDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, permissions } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'reviews');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const canEditOrDelete = permissions?.includes("APPROVE_BOOK") || (book && user && book.uploaderUsername === user.username);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await bookApi.getBook(id!);
        setBook(res.data.data);
        setBookmarked(res.data.data.bookmarked || false);
        if (location.state?.tab) {
          setActiveTab(location.state.tab);
        }
      } catch (err) {
        toast.error(t('bookDetails.loadFailed'));
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
        toast.success(t('bookDetails.bookmarkRemoved'));
      } else {
        const res = await bookmarkApi.addBookmark(id!);
        setBookmarked(true);
        setBook((prev: any) => ({ ...prev, bookmarked: true, userBookmarkId: res.data.data.id }));
        toast.success(t('bookDetails.bookmarkAdded'));
      }
    } catch (err) {
      toast.error(t('bookDetails.bookmarkUpdateFailed'));
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('bookDetails.deleteConfirm'))) {
      try {
        await bookApi.deleteBook(id!);
        toast.success(t('bookDetails.deleteSuccess'));
        navigate("/browse");
      } catch (err) {
        toast.error(t('bookDetails.deleteFailed'));
      }
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
        {t('bookDetails.notFound')}
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00502D] mb-6">
        <ArrowLeft size={16} /> {t('bookDetails.back')}
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
                  {book.categories?.map((cat: string) => (
                    <span key={cat} className="px-2 py-1 bg-green-50 text-[#00502D] text-xs font-semibold rounded uppercase tracking-wider">{cat}</span>
                  ))}
                  {book.tags?.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">{t('bookDetails.by', { author: book.author })}</p>
                <p className="text-sm text-gray-500 mt-1">{t('bookDetails.uploadedBy')} <span className="font-medium text-gray-700">{book.uploaderUsername || t('bookDetails.system')}</span></p>
                {book.series && <p className="text-sm text-purple-600 font-medium mt-1">{t('bookDetails.series', { name: book.series.name })}</p>}
              </div>
              <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star fill="currentColor" size={20} />
                  <span className="font-bold text-xl text-gray-900">{book.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
                <span className="text-xs text-gray-500">{t('bookDetails.reviewsCount', { count: book.reviewCount || 0 })}</span>
                <div className="flex flex-col items-center mt-2 pt-2 border-t border-gray-200 w-full text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span className="text-xs font-medium">{t('bookDetails.viewsCount', { count: book.views || 0 })}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-6 leading-relaxed flex-1">
              {book.description || t('bookDetails.noDescription')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={`/read/${id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00502D] text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-sm">
                <BookOpen size={20} /> {t('bookDetails.readNow')}
              </Link>
              <button 
                onClick={handleBookmarkToggle}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold border transition-colors ${bookmarked ? 'bg-green-50 text-[#00502D] border-green-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} /> 
                {bookmarked ? t('bookDetails.saved') : t('bookDetails.bookmark')}
              </button>
              <button 
                onClick={() => setReportModalOpen(true)}
                className={`p-3 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 border border-transparent transition-colors group relative ${!canEditOrDelete ? 'ml-auto' : ''}`}
              >
                <Flag size={20} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{t('bookDetails.reportContent')}</span>
              </button>

              {canEditOrDelete && (
                <div className="flex gap-2 ml-auto">
                  <button 
                    onClick={() => setEditModalOpen(true)}
                    className="p-3 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 border border-transparent transition-colors group relative"
                  >
                    <Edit size={20} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{t('bookDetails.editBook')}</span>
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-3 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 border border-transparent transition-colors group relative"
                  >
                    <Trash2 size={20} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{t('bookDetails.deleteBook')}</span>
                  </button>
                </div>
              )}
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
            {t('bookDetails.reviews')}
          </button>
          <button 
            onClick={() => setActiveTab('discussion')}
            className={`pb-3 font-bold text-lg flex items-center gap-2 transition-colors ${activeTab === 'discussion' ? 'border-b-2 border-[#00502D] text-[#00502D]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <MessageSquare size={20} /> 
            {t('bookDetails.discussion')}
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

      <EditBookModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        book={book}
        onSuccess={(updatedBook) => setBook(updatedBook)}
      />
    </div>
  );
}
