import { Link } from "react-router";
import { Star, BookOpen, Eye, Edit, Trash2 } from "lucide-react";
import { SecureImage } from "@/components/SecureImage";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { EditBookModal } from "./EditBookModal";
import { bookApi } from "../../../lib/api";
import { toast } from "sonner";

export function BookCard({ book, onBookDeleted, onBookUpdated }: { book: any, onBookDeleted?: (id: number) => void, onBookUpdated?: (book: any) => void }) {
  const { user, permissions } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const canEditOrDelete = permissions?.includes("APPROVE_BOOK") || (user && book.uploaderUsername === user.username);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      try {
        await bookApi.deleteBook(book.id);
        toast.success("Book deleted successfully");
        if (onBookDeleted) onBookDeleted(book.id);
      } catch (err) {
        toast.error("Failed to delete book");
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditModalOpen(true);
  };

  return (
    <>
      <Link to={`/book/${book.id}`} className="group flex flex-col bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative h-full">
        <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-gray-100">
          {book.thumbnailPath ? (
            <SecureImage src={`/books/${book.id}/thumbnail`} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-900/5 to-[#00502D]/10 flex items-center justify-center p-4">
              <BookOpen size={40} className="text-[#00502D]/20" />
            </div>
          )}
          
          {book.status && book.status !== 'LIVE' && (
             <div className="absolute bottom-2 left-2 right-2 text-center bg-yellow-100/90 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded backdrop-blur">
               {book.status}
             </div>
          )}

          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm text-gray-800 flex items-center gap-1 border border-gray-100/50">
            <Star size={12} className="text-yellow-500" fill="currentColor" />
            {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
          </div>
          
          {canEditOrDelete && (
            <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleEditClick} className="p-1.5 bg-white/90 hover:bg-blue-50 text-blue-600 rounded shadow backdrop-blur transition-colors border border-gray-100" title="Edit Book">
                <Edit size={14} />
              </button>
              <button onClick={handleDelete} className="p-1.5 bg-white/90 hover:bg-red-50 text-red-600 rounded shadow backdrop-blur transition-colors border border-gray-100" title="Delete Book">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">{book.title}</h3>
        <p className="text-xs text-gray-500 truncate mb-3">{book.author || 'Unknown Author'}</p>
        
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span className="truncate max-w-[100px]" title={book.uploaderUsername}>By {book.uploaderUsername || 'System'}</span>
          <div className="flex items-center gap-1 shrink-0">
            <Eye size={12} />
            {book.views || 0}
          </div>
        </div>
      </Link>
      
      {canEditOrDelete && (
        <EditBookModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          book={book}
          onSuccess={(updatedBook) => {
            setEditModalOpen(false);
            if (onBookUpdated) onBookUpdated(updatedBook);
          }}
        />
      )}
    </>
  );
}
