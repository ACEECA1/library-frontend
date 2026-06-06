import { useEffect, useState } from "react";
import { CommentItem } from "./CommentItem";
import api from "../../../lib/api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function CommentList({ bookId }: { bookId: string | undefined }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/books/${bookId}/comments?size=20&sort=createdAt,desc`);
        setComments(res.data.data.content || []);
      } catch (err) {
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [bookId]);

  if (loading) return <div className="text-gray-500 text-sm">Loading comments...</div>;
  if (comments.length === 0) return <div className="text-gray-500 text-sm italic">No comments yet. Start the discussion!</div>;

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem 
          key={comment.id}
          name={comment.username} 
          date={formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })} 
          text={comment.text} 
          upvotes={comment.upvotes} 
          downvotes={comment.downvotes} 
        />
      ))}
    </div>
  );
}
