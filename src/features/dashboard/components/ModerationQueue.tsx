import { useState, useEffect } from "react";
import { Check, X, Book, AlertTriangle, ShieldCheck } from "lucide-react";
import { bookApi, reportApi } from "../../../lib/api";
import { toast } from "sonner";
import { SecureImage } from "@/components/SecureImage";
import { formatDistanceToNow } from "date-fns";

export function ModerationQueue() {
  const [pendingBooks, setPendingBooks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<'books' | 'reports'>('books');

  const fetchData = async () => {
    try {
      setLoading(true);
      if (subTab === 'books') {
        const res = await bookApi.getPendingBooks();
        setPendingBooks(res.data.data?.content || []);
      } else {
        const res = await reportApi.getReports(false, { size: 50, sort: 'createdAt,desc' });
        setReports(res.data.content || res.data.data?.content || []); // Depending on the api wrapper
      }
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subTab]);
  const handleApprove = async (id: number) => {
    try {
      await bookApi.approveBook(id);
      toast.success("Book approved successfully");
      fetchData();
    } catch (err) {
      toast.error("Failed to approve book");
    }
  };

  const handleResolveReport = async (id: number) => {
    try {
      await reportApi.resolveReport(id);
      toast.success("Report resolved");
      fetchData();
    } catch (err) {
      toast.error("Failed to resolve report");
    }
  };
  if (loading) {
    return <div className="text-gray-500 p-4">Loading moderation queue...</div>;
  }

  return (
    <div>
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${subTab === 'books' ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setSubTab('books')}
        >
          <Book size={18} /> Pending Books
        </button>
        <button 
          className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${subTab === 'reports' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setSubTab('reports')}
        >
          <AlertTriangle size={18} /> User Reports
        </button>
      </div>

      {subTab === 'books' && (
        pendingBooks.length === 0 ? (
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
                  href={`/read/${book.id}`}
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
        )
      )}
      {subTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">No active reports to review.</div>
          ) : (
            reports.map(report => (
              <div key={report.id} className="flex flex-col sm:flex-row items-start justify-between p-4 border border-orange-100 rounded-lg bg-orange-50/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      {report.targetType}
                    </span>
                    <span className="text-xs text-gray-500">
                      Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })} by <span className="font-semibold">{report.reporterUsername}</span>
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">Reason:</p>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded border border-orange-100">{report.reason}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex gap-4">
                    <span>Target ID: <span className="font-mono">{report.targetId}</span></span>
                    <span>Status: <span className={`font-semibold ${report.resolved ? 'text-green-600' : 'text-orange-600'}`}>{report.resolved ? 'RESOLVED' : 'PENDING'}</span></span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleResolveReport(report.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-100 text-green-700 px-4 py-2 rounded font-medium hover:bg-green-200 transition-colors"
                  >
                    <ShieldCheck size={16} /> Resolve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
