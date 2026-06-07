import { useState, useEffect } from "react";
import { Check, X, Book } from "lucide-react";
import { bookApi } from "../../../lib/api";
import { toast } from "sonner";
import { SecureImage } from "@/components/SecureImage";
export function ModerationQueue() {
  const [pendingBooks, setPendingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPendingBooks = async () => {
    try {
      setLoading(true);
      const res = await bookApi.getPendingBooks();
      setPendingBooks(res.data.data.content || []);
    } catch (err) {
      toast.error("Failed to load pending books");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingBooks();
  }, []);
  const handleApprove = async (id: number) => {
    try {
      await bookApi.approveBook(id);
      toast.success("Book approved successfully");
      fetchPendingBooks();
    } catch (err) {
      toast.error("Failed to approve book");
    }
  };
  if (loading) {
    return <div className="text-gray-500">Loading moderation queue...</div>;
  }
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Pending Books</h2>
      {pendingBooks.length === 0 ? (
        <div className="text-gray-500 italic">No pending books to moderate.</div>
      ) : (
        <div className="space-y-4">
          {pendingBooks.map(book => (
            <div key={book.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="w-12 h-16 bg-gray-200 flex items-center justify-center rounded">
                  {book.thumbnailPath ? (
                    <SecureImage src={`/books/${book.id}/thumbnail`} alt="cover" className="w-full h-full object-cover rounded" />
                  ) : (
                    <Book className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600 font-medium">by {book.author}</p>
                  
                  {book.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{book.description}</p>
                  )}
                  
                  {(book.categories?.length > 0 || book.tags?.length > 0) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.categories?.map((cat: string) => (
                        <span key={cat} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] uppercase font-bold rounded">
                          {cat}
                        </span>
                      ))}
                      {book.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-2">Uploaded by: <span className="font-medium text-gray-600">{book.uploaderUsername || 'Unknown'}</span></p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <a 
                  href={`/reader/${book.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-blue-100 text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-200"
                >
                  <Book size={16} /> Read
                </a>
                <button 
                  onClick={() => handleApprove(book.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700"
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-100 text-red-600 px-4 py-2 rounded font-medium hover:bg-red-200"
                  onClick={() => toast.info("Reject functionality to be implemented")}
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
