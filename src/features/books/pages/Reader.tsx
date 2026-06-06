import { useParams, Link } from "react-router";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export function Reader() {
  const { id } = useParams();
  const [progress, setProgress] = useState(1);
  const totalPages = 342;


  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(`Progress saved: page ${progress}`);
    }, 1000);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-300">

      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/book/${id}`} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Back to details">
            <ArrowLeft size={20} className="text-gray-300" />
          </Link>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="font-medium text-white truncate max-w-xs md:max-w-md">Structural Analysis & Design</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1 mr-2">
            <button className="p-1.5 hover:bg-gray-600 rounded">
              <ZoomOut size={18} />
            </button>
            <span className="text-sm font-medium px-2">100%</span>
            <button className="p-1.5 hover:bg-gray-600 rounded">
              <ZoomIn size={18} />
            </button>
          </div>
          <button className="p-2 hover:bg-gray-700 rounded-lg hidden sm:block">
            <Maximize size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <Settings size={20} />
          </button>
        </div>
      </div>


      <div className="flex-1 overflow-auto bg-gray-900 flex justify-center py-8 px-4 relative">
        <div className="w-full max-w-4xl bg-white min-h-[1000px] shadow-2xl rounded-sm p-16 text-black flex flex-col items-center justify-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 text-center">
            <p className="mb-4">PDF Content Area</p>
            <p className="text-sm">Page {progress} of {totalPages}</p>
          </div>
        </div>


        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur border border-gray-700 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6">
          <button 
            onClick={() => setProgress(p => Math.max(1, p - 1))}
            disabled={progress === 1}
            className="text-gray-300 hover:text-white disabled:opacity-50 font-medium"
          >
            Prev
          </button>
          <div className="text-sm font-medium text-white flex items-center gap-2">
            <input 
              type="number" 
              value={progress}
              onChange={(e) => setProgress(Math.min(totalPages, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-12 bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-center focus:outline-none focus:border-green-500 appearance-none"
            />
            <span>/ {totalPages}</span>
          </div>
          <button 
            onClick={() => setProgress(p => Math.min(totalPages, p + 1))}
            disabled={progress === totalPages}
            className="text-gray-300 hover:text-white disabled:opacity-50 font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
