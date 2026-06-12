import { Link } from "react-router";
import { Star, BookOpen, Eye, Edit, Trash2 } from "lucide-react";
import { SecureImage } from "@/components/SecureImage";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { EditBookModal } from "./EditBookModal";
import { bookApi } from "../../../lib/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

export function BookCard({ book, onBookDeleted, onBookUpdated }: { book: any, onBookDeleted?: (id: number) => void, onBookUpdated?: (book: any) => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const canEditOrDelete = user?.permissions?.includes("APPROVE_BOOK") || (user && book.uploaderUsername === user.username);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await bookApi.deleteBook(book.id);
      toast.success(t('bookCard.deleteSuccess'));
      if (onBookDeleted) onBookDeleted(book.id);
    } catch (err) {
      toast.error(t('bookCard.deleteFailed'));
    }
    setDeleteConfirmOpen(false);
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
            {book.averageRating ? book.averageRating.toFixed(1) : t('bookCard.new')}
          </div>
          
          {canEditOrDelete && (
            <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleEditClick} className="p-1.5 bg-white/90 hover:bg-blue-50 text-blue-600 rounded shadow backdrop-blur transition-colors border border-gray-100" title={t('bookCard.editBook')}>
                <Edit size={14} />
              </button>
              <button onClick={handleDelete} className="p-1.5 bg-white/90 hover:bg-red-50 text-red-600 rounded shadow backdrop-blur transition-colors border border-gray-100" title={t('bookCard.deleteBook')}>
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">{book.title}</h3>
        <p className="text-xs text-gray-500 truncate mb-3">{book.author || t('bookCard.unknownAuthor')}</p>
        
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span className="truncate max-w-[100px]" title={book.uploaderUsername}>{t('bookCard.by', { uploader: book.uploaderUsername || t('bookCard.system') })}</span>
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

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
