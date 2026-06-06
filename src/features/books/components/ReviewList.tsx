import { useEffect, useState } from "react";
import { ReviewItem } from "./ReviewItem";
import api from "../../../lib/api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function ReviewList({ bookId }: { bookId: string | undefined }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reviews/book/${bookId}?size=20&sort=createdAt,desc`);
        setReviews(res.data.data.content || []);
      } catch (err) {
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [bookId]);

  if (loading) return <div className="text-gray-500 text-sm">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="text-gray-500 text-sm italic">No reviews yet. Be the first to review!</div>;

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <ReviewItem 
          key={review.id}
          name={review.username} 
          date={formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })} 
          rating={review.rating} 
          text={review.text} 
        />
      ))}
    </div>
  );
}
