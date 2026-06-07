import { ThumbsUp, ThumbsDown, Reply, Flag } from "lucide-react";
export function CommentItem({ 
  name, date, text, upvotes, downvotes, onUpvote, onDownvote 
}: { 
  name: string, date: string, text: string, upvotes: number, downvotes: number,
  onUpvote?: () => void, onDownvote?: () => void 
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-green-100 text-[#00502D] rounded-full flex items-center justify-center font-bold shrink-0">
        {name.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-bold text-gray-900">{name}</span>
              <span className="text-gray-500 text-xs ml-2">{date}</span>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Flag size={14} />
            </button>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
        </div>
        <div className="flex items-center gap-4 mt-2 ml-2">
          <button onClick={onUpvote} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#00502D] transition-colors">
            <ThumbsUp size={14} /> {upvotes}
          </button>
          <button onClick={onDownvote} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors">
            <ThumbsDown size={14} /> {downvotes}
          </button>
          <button className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors ml-2">
            <Reply size={14} /> Reply
          </button>
        </div>
      </div>
    </div>
  );
}
