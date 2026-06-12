import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, Minimize, FileText } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { bookApi } from "../../../lib/api";
import { Document, Page, pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function LazyPage({ pageNumber, scale, onVisible }: { pageNumber: number, scale: number, onVisible: (p: number) => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          onVisible(pageNumber);
        }
      },
      { rootMargin: '1000px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pageNumber, onVisible]);

  return (
    <div id={`page_${pageNumber}`} ref={ref} style={{ minHeight: `${800 * scale}px`, marginBottom: '24px' }} className="flex justify-center w-full">
      {isVisible ? (
        <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} className="shadow-2xl bg-white" />
      ) : (
        <div className="bg-gray-800 animate-pulse" style={{ width: `${600 * scale}px`, height: `${800 * scale}px` }} />
      )}
    </div>
  );
}

export function Reader() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookTitle, setBookTitle] = useState(t('reader.loading'));
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      bookApi.getBook(id).then(res => {
        setBookTitle(res.data.data.title);
      }).catch(err => {
        console.error(err);
        setBookTitle(t('reader.unknownBook'));
      });
      const loadPdf = async () => {
        try {
          const response = await bookApi.getBookStream(id);
          const url = URL.createObjectURL(response.data);
          setPdfUrl(url);
        } catch (err) {
          console.error(err);
          setError(t('reader.failedToLoad'));
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (id) {
      bookApi.getProgress(id).then(res => {
        const savedPage = res.data.data?.lastPageRead;
        if (savedPage) {
          setTimeout(() => {
            const el = document.getElementById('page_' + savedPage);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500);
        }
      }).catch(err => console.error("Failed to fetch progress", err));
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleVisible = useCallback((p: number) => {
    setPageNumber(p);
  }, []);

  useEffect(() => {
    if (id && pageNumber > 1) {
      const timeout = setTimeout(() => {
        bookApi.updateProgress(id, pageNumber).catch(console.error);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [id, pageNumber]);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-gray-900 text-gray-300 overflow-hidden">
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title={t('reader.back')}>
            <ArrowLeft size={20} className="text-gray-300" />
          </button>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="font-medium text-white truncate max-w-xs md:max-w-md">{bookTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
          {numPages && (
            <div className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-1 rounded-md">
              <span>{pageNumber} / {numPages}</span>
            </div>
          )}
          <button onClick={zoomOut} className="p-2 hover:bg-gray-700 rounded-lg" title={t('reader.zoomOut')}><ZoomOut size={20} /></button>
          <button onClick={zoomIn} className="p-2 hover:bg-gray-700 rounded-lg" title={t('reader.zoomIn')}><ZoomIn size={20} /></button>
          <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-700 rounded-lg" title={isFullscreen ? t('reader.exitFullscreen') : t('reader.fullscreen')}>
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-900 relative p-4 flex flex-col items-center">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400">{error}</p>
          </div>
        ) : pdfUrl ? (
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className="w-full flex flex-col items-center" loading={<div className="text-white">{t('reader.loadingPdf')}</div>}>
            {numPages && Array.from(new Array(numPages), (el, index) => (
              <LazyPage 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                scale={scale} 
                onVisible={handleVisible} 
              />
            ))}
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>{t('reader.loadingDocument')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
