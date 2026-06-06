import { useState } from "react";
import { ArrowUp, ArrowDown, Flag } from "lucide-react";

export function CommentItem({ name, date, text, upvotes, downvotes }: any) {
  const [localUp, setLocalUp] = useState(upvotes);
  const [localDown, setLocalDown] = useState(downvotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const handleUpvote = () => {
    if (voted === "up") {
      setLocalUp(localUp - 1);
      setVoted(null);
    } else {
      setLocalUp(localUp + 1);
      if (voted === "down") setLocalDown(localDown - 1);
      setVoted("up");
    }
  };

  const handleDownvote = () => {
    if (voted === "down") {
      setLocalDown(localDown - 1);
      setVoted(null);
    } else {
      setLocalDown(localDown + 1);
      if (voted === "up") setLocalUp(localUp - 1);
      setVoted("down");
    }
  };

  return (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-gray-900">{name}</h4>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <p className="text-gray-700 text-sm mb-3">{text}</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
            <button 
              onClick={handleUpvote}
              className={`hover:text-green-600 flex items-center gap-1 ${voted === 'up' ? 'text-green-600' : 'text-gray-500'}`}
            >
              <ArrowUp size={14} /> {localUp}
            </button>
            <div className="w-px h-3 bg-gray-300"></div>
            <button 
              onClick={handleDownvote}
              className={`hover:text-red-600 flex items-center gap-1 ${voted === 'down' ? 'text-red-600' : 'text-gray-500'}`}
            >
              <ArrowDown size={14} /> {localDown}
            </button>
          </div>
          <button className="text-gray-500 hover:text-[#00502D] font-medium">Reply</button>
          <button className="hover:text-red-600 ml-auto flex items-center gap-1 text-gray-500"><Flag size={12} /> Report</button>
        </div>
      </div>
    </div>
  );
}
