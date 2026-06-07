import { useParams, Link } from "react-router";
import { ArrowLeft, ZoomIn, ZoomOut, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { bookApi } from "../../../lib/api";
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export function Reader() {
  const { id } = useParams();
  const [bookTitle, setBookTitle] = useState("Loading...");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);
  useEffect(() => {
    if (id) {
      bookApi.getBook(id).then(res => {
        setBookTitle(res.data.data.title);
      }).catch(err => {
        console.error(err);
        setBookTitle("Unknown Book");
      });
      const loadPdf = async () => {
        try {
          const response = await bookApi.getBookStream(id);
          const url = URL.createObjectURL(response.data);
          setPdfUrl(url);
        } catch (err) {
          console.error(err);
          setError("Failed to load document");
        }
      };
      loadPdf();
    }
  }, [id]);
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const nextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  const prevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-300">
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/book/${id}`} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Back to details">
            <ArrowLeft size={20} className="text-gray-300" />
          </Link>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="font-medium text-white truncate max-w-xs md:max-w-md">{bookTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
          {numPages && (
            <div className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-1 rounded-md">
              <button onClick={prevPage} disabled={pageNumber <= 1} className="disabled:opacity-50">&lt;</button>
              <span>{pageNumber} / {numPages}</span>
              <button onClick={nextPage} disabled={pageNumber >= numPages} className="disabled:opacity-50">&gt;</button>
            </div>
          )}
          <button onClick={zoomOut} className="p-2 hover:bg-gray-700 rounded-lg" title="Zoom Out"><ZoomOut size={20} /></button>
          <button onClick={zoomIn} className="p-2 hover:bg-gray-700 rounded-lg" title="Zoom In"><ZoomIn size={20} /></button>
          <button className="p-2 hover:bg-gray-700 rounded-lg" title="Log Book Index" onClick={async () => {
            try {
              const res = await bookApi.getBookContent(id!);
              console.log("Book Text Content:", res.data);
              alert("Book index/content logged to browser console!");
            } catch (e) {
              alert("Failed to get book content.");
            }
          }}>
            <FileText size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-900 relative flex justify-center p-4">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400">{error}</p>
          </div>
        ) : pdfUrl ? (
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center" loading={<div className="text-white">Loading PDF...</div>}>
            <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} className="shadow-2xl" />
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading document...</p>
          </div>
        )}
      </div>
    </div>
  );
}
