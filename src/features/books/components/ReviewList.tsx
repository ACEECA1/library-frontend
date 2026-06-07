import { useEffect, useState } from "react";
import { ReviewItem } from "./ReviewItem";
import { reviewApi } from "../../../lib/api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";
import { ReportModal } from "../../../components/ReportModal";

export function ReviewList({ bookId }: { bookId: string | number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<number | null>(null);
  
  const fetchReviews = async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      const res = await reviewApi.getReviews(bookId, { size: 20, sort: 'createdAt,desc' });
      setReviews(res.data.data.content || []);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [bookId]);
  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      await reviewApi.addReview({ bookId: Number(bookId), rating, text });
      toast.success("Review submitted!");
      setRating(0);
      setText("");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                onClick={() => setRating(star)}
                className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
              >
                <Star size={20} fill={star <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">Rate this book</span>
        </div>
        <textarea 
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#00502D] min-h-[80px] resize-y"
        ></textarea>
        <div className="mt-3 flex justify-end">
          <button onClick={handleSubmitReview} className="bg-[#00502D] text-white px-5 py-1.5 text-sm rounded-lg font-medium hover:bg-green-800">
            Post Review
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No reviews yet. Be the first to review!</div>
      ) : (
        reviews.map(review => (
          <ReviewItem 
            key={review.id}
            name={review.username} 
            date={formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })} 
            rating={review.rating} 
            text={review.text} 
            onReport={() => {
              setReportTargetId(review.id);
              setReportModalOpen(true);
            }}
          />
        ))
      )}
      
      {reportTargetId && (
        <ReportModal 
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          targetType="REVIEW"
          targetId={reportTargetId}
        />
      )}
    </div>
  );
}
