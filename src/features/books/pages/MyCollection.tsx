import { Link } from "react-router";
import { BookMarked, PlayCircle } from "lucide-react";

export function MyCollection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
        <BookMarked size={28} className="text-[#00502D]" />
        <h1 className="text-3xl font-bold text-gray-900">My Collection</h1>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Currently Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 shrink-0 aspect-[2/3] bg-gradient-to-br from-[#00502D] to-green-900 rounded shadow-sm"></div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">Structural Analysis Vol {i}</h3>
                  <p className="text-sm text-gray-500 mb-3">Engineering Dept.</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>45 / 300 pages (15%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-[#00502D] h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <Link to={`/read/${i}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#00502D] hover:text-green-800">
                      <PlayCircle size={16} /> Continue Reading
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 mt-12">Saved for Later</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(5).fill(0).map((_, i) => (
              <Link to={`/book/${i+10}`} key={i} className="group flex flex-col">
                <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
                  <div className="w-full h-full bg-[#00502D]/10 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
                    Saved Book {i+1}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">Saved Book Title {i+1}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 mt-12">
            <h2 className="text-xl font-bold text-gray-900">My Uploads</h2>
            <Link to="/admin" className="text-sm font-semibold text-[#00502D] hover:underline">Upload New Book</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Link to={`/book/${i+20}`} key={i} className="group flex flex-col">
                <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg shadow-sm bg-gray-200">
                  <div className="w-full h-full bg-blue-900/10 flex items-center justify-center text-[#00502D] font-medium text-center p-4">
                    My Upload {i+1}
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-1 rounded text-green-700 shadow-sm">
                    Approved
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#00502D] transition-colors line-clamp-2">Civil Eng Upload {i+1}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
