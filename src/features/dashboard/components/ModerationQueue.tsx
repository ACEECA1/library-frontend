import { useState, useEffect } from "react";
import { Check, X, Book, AlertTriangle, ShieldCheck } from "lucide-react";
import { bookApi, reportApi } from "../../../lib/api";
import { toast } from "sonner";
import { SecureImage } from "@/components/SecureImage";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

export function ModerationQueue() {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [pendingBooks, setPendingBooks] = useState<any[]>([]);
  const [archivedBooks, setArchivedBooks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const canApprove = hasPermission('APPROVE_BOOK');
  const canModerate = hasPermission('MODERATE_COMMENT');
  
  const [subTab, setSubTab] = useState<'books' | 'reports' | 'archived'>(canApprove ? 'books' : 'reports');

  const fetchData = async () => {
    try {
      setLoading(true);
      if (subTab === 'books') {
        const res = await bookApi.getPendingBooks();
        setPendingBooks(res.data.data?.content || []);
      } else if (subTab === 'archived') {
        const res = await bookApi.getArchivedBooks();
        setArchivedBooks(res.data.data?.content || []);
      } else {
        const res = await reportApi.getReports(false, { size: 50, sort: 'createdAt,desc' });
        setReports(res.data.content || res.data.data?.content || []); // Depending on the api wrapper
      }
    } catch (err) {
      toast.error(t('moderation.failedLoad'));
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
      toast.success(t('moderation.bookApproved'));
      fetchData();
    } catch (err) {
      toast.error(t('moderation.failedApprove'));
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await bookApi.restoreBook(id);
      toast.success(t('moderation.bookRestored'));
      fetchData();
    } catch (err) {
      toast.error(t('moderation.failedRestore'));
    }
  };

  const handleResolveReport = async (id: number) => {
    try {
      await reportApi.resolveReport(id);
      toast.success(t('moderation.reportResolved'));
      fetchData();
    } catch (err) {
      toast.error(t('moderation.failedResolve'));
    }
  };
  if (loading) {
    return <div className="text-gray-500 p-4">{t('moderation.loading')}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-6">
        {canApprove && (
          <>
            <button 
              className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${subTab === 'books' ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSubTab('books')}
            >
              <Book size={18} /> {t('moderation.pendingBooks')}
            </button>
            <button 
              className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${subTab === 'archived' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSubTab('archived')}
            >
              <Book size={18} /> {t('moderation.archivedBooks')}
            </button>
          </>
        )}
        {canModerate && (
          <button 
            className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${subTab === 'reports' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSubTab('reports')}
          >
            <AlertTriangle size={18} /> {t('moderation.userReports')}
          </button>
        )}
      </div>

      {subTab === 'books' && (
        pendingBooks.length === 0 ? (
        <div className="text-gray-500 italic">{t('moderation.noPending')}</div>
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
                  <p className="text-sm text-gray-600 font-medium">{t('moderation.by', { author: book.author })}</p>
                  
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
                  
                  <p className="text-xs text-gray-400 mt-2">{t('moderation.uploadedBy')} <span className="font-medium text-gray-600">{book.uploaderUsername || 'Unknown'}</span></p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <a 
                  href={`/read/${book.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-blue-100 text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-200"
                >
                  <Book size={16} /> {t('moderation.read')}
                </a>
                <button 
                  onClick={() => handleApprove(book.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700"
                >
                  <Check size={16} /> {t('moderation.approve')}
                </button>
                <button 
                  onClick={async () => {
                    if(window.confirm(t('moderation.rejectConfirm'))) {
                      try {
                        await bookApi.deleteBook(book.id);
                        toast.success(t('moderation.bookRejected'));
                        fetchData();
                      } catch (err) {
                        toast.error(t('moderation.failedReject'));
                      }
                    }
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-100 text-red-600 px-4 py-2 rounded font-medium hover:bg-red-200"
                >
                  <X size={16} /> {t('moderation.reject')}
                </button>
              </div>
            </div>
          ))}
        </div>
        )
      )}
      
      {subTab === 'archived' && (
        archivedBooks.length === 0 ? (
        <div className="text-gray-500 italic">{t('moderation.noArchived')}</div>
      ) : (
        <div className="space-y-4">
          {archivedBooks.map(book => (
            <div key={book.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-gray-50 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="w-12 h-16 bg-gray-200 flex items-center justify-center rounded">
                  {book.thumbnailPath ? (
                    <SecureImage src={`/books/${book.id}/thumbnail`} alt="cover" className="w-full h-full object-cover rounded grayscale" />
                  ) : (
                    <Book className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-through decoration-red-500">{book.title}</h3>
                  <p className="text-sm text-gray-600 font-medium">{t('moderation.by', { author: book.author })}</p>
                  <p className="text-xs text-red-500 font-bold mt-1">{t('moderation.statusDeleted')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('moderation.viewsBefore')} <span className="font-medium text-gray-600">{book.views}</span></p>
                  <p className="text-xs text-gray-400">{t('moderation.uploadedBy')} <span className="font-medium text-gray-600">{book.uploaderUsername || 'Unknown'}</span></p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleRestore(book.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-purple-100 text-purple-700 px-4 py-2 rounded font-medium hover:bg-purple-200 transition-colors"
                >
                  <Check size={16} /> {t('moderation.restore')}
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
            <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">{t('moderation.noReports')}</div>
          ) : (
            reports.map(report => (
              <div key={report.id} className="flex flex-col sm:flex-row items-start justify-between p-4 border border-orange-100 rounded-lg bg-orange-50/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      {report.targetType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t('moderation.reportedBy', { date: formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }) })} <span className="font-semibold">{report.reporterUsername}</span>
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">{t('moderation.reason')}</p>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded border border-orange-100">{report.reason}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex gap-4">
                    <span>{t('moderation.targetId')} <span className="font-mono">{report.targetId}</span></span>
                    <span>{t('moderation.status')} <span className={`font-semibold ${report.resolved ? 'text-green-600' : 'text-orange-600'}`}>{report.resolved ? 'RESOLVED' : 'PENDING'}</span></span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleResolveReport(report.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-100 text-green-700 px-4 py-2 rounded font-medium hover:bg-green-200 transition-colors"
                  >
                    <ShieldCheck size={16} /> {t('moderation.resolve')}
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
