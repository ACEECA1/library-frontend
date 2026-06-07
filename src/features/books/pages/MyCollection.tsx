import { Link } from 'react-router';
import { BookMarked, UploadCloud, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookmarkApi, bookApi } from '../../../lib/api';
import { BookResponseDTO } from '../../../lib/types';
import { SecureImage } from '@/components/SecureImage';
import { BookCard } from '../components/BookCard';
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
                <BookCard 
                  key={bookmark.id} 
                  book={{
                    id: bookmark.bookId,
                    title: bookmark.bookTitle,
                    thumbnailPath: bookmark.bookThumbnailPath,
                    author: bookmark.bookAuthor,
                    averageRating: bookmark.bookAverageRating,
                    uploaderUsername: bookmark.bookUploaderUsername,
                    views: bookmark.bookViews
                  }}
                  onBookDeleted={(id) => setBookmarks(bookmarks.filter(b => b.bookId !== id))}
                  onBookUpdated={(updated) => setBookmarks(bookmarks.map(b => b.bookId === updated.id ? { 
                    ...b, 
                    bookTitle: updated.title, 
                    bookThumbnailPath: updated.thumbnailPath,
                    bookAuthor: updated.author
                  } : b))}
                />
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
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBookDeleted={(id) => setUploads(uploads.filter(b => b.id !== id))}
                  onBookUpdated={(updated) => setUploads(uploads.map(b => b.id === updated.id ? updated : b))}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
