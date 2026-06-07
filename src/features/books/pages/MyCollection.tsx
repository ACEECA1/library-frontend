import { Link } from 'react-router';
import { BookMarked, UploadCloud, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookmarkApi, bookApi } from '../../../lib/api';
import { BookResponseDTO } from '../../../lib/types';
import { SecureImage } from '@/components/SecureImage';
export function MyCollection() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [uploads, setUploads] = useState<BookResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      bookmarkApi.getBookmarks().then(res => setBookmarks(res.data.data.content || [])).catch(err => console.error(err)),
      bookApi.getMyUploads().then(res => setUploads(res.data.data.content || [])).catch(err => console.error(err))
    ]).finally(() => setLoading(false));
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
        <BookMarked size={28} className="text-[#00502D]" />
        <h1 className="text-3xl font-bold text-gray-900">My Collection</h1>
      </div>
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-4 mt-4">
            <BookMarked className="text-gray-700" size={20} />
            <h2 className="text-xl font-bold text-gray-900">Saved Books</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : bookmarks.length === 0 ? (
            <p className="text-gray-500">No books saved to your collection yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {bookmarks.map((bookmark) => (
                <Link to={`/book/${bookmark.bookId}`} key={bookmark.id} className="group flex flex-col">
                  <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
                    {bookmark.bookThumbnailPath ? (
                      <SecureImage src={`/books/${bookmark.bookId}/thumbnail`} alt={bookmark.bookTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-[#00502D]/10 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
                        {bookmark.bookTitle}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">{bookmark.bookTitle}</h3>
                </Link>
              ))}
            </div>
          )}
        </section>
        <section>
          <div className="flex items-center gap-2 mb-4 mt-4">
            <UploadCloud className="text-gray-700" size={20} />
            <h2 className="text-xl font-bold text-gray-900">My Uploads</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : uploads.length === 0 ? (
            <p className="text-gray-500">You haven't uploaded any books yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {uploads.map((book) => (
                <Link to={`/book/${book.id}`} key={book.id} className="group flex flex-col">
                  <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
                    {book.thumbnailPath ? (
                      <SecureImage src={`/books/${book.id}/thumbnail`} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-[#00502D]/10 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
                        {book.title}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm ${book.status === 'LIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {book.status}
                      </span>
                      <div className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-800 flex items-center gap-1">
                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                        {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">{book.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
