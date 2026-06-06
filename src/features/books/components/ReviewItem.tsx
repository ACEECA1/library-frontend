import { Star, Flag } from "lucide-react";

export function ReviewItem({ name, date, rating, text, badge }: any) {
  return (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-green-100 text-[#00502D] rounded-full flex items-center justify-center font-bold shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900">{name}</h4>
            {badge && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded uppercase">{badge}</span>}
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <div className="flex items-center gap-1 mb-2 text-yellow-500">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i >= rating ? "text-gray-300" : ""} />
          ))}
        </div>
        <p className="text-gray-700 text-sm">{text}</p>
        <div className="mt-3 flex justify-end text-xs text-gray-500">
          <button className="hover:text-red-600 flex items-center gap-1"><Flag size={12} /> Report</button>
        </div>
      </div>
    </div>
  );
}
