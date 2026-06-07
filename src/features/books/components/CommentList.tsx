import { useEffect, useState } from "react";
import { CommentItem } from "./CommentItem";
import { commentApi } from "../../../lib/api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
export function CommentList({ bookId }: { bookId: string | number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const fetchComments = async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      const res = await commentApi.getComments(bookId, { size: 20, sort: 'createdAt,desc' });
      setComments(res.data.data.content || []);
    } catch (err) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [bookId]);
  const handlePostComment = async () => {
    if (!newComment.trim() || !bookId) return;
    try {
      await commentApi.addComment(bookId, newComment);
      setNewComment("");
      toast.success("Comment posted!");
      fetchComments();
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };
  const handleUpvote = async (commentId: number) => {
    try {
      await commentApi.upvote(bookId, commentId);
      fetchComments();
    } catch (err) {
      toast.error("Failed to upvote");
    }
  };
  const handleDownvote = async (commentId: number) => {
    try {
      await commentApi.downvote(bookId, commentId);
      fetchComments();
    } catch (err) {
      toast.error("Failed to downvote");
    }
  };
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
        <textarea 
          placeholder="Join the discussion..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#00502D] min-h-[80px] resize-y mb-3"
        ></textarea>
        <div className="flex justify-end">
          <button onClick={handlePostComment} className="bg-[#00502D] text-white px-5 py-1.5 text-sm rounded-lg font-medium hover:bg-green-800">
            Post Comment
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No comments yet. Start the discussion!</div>
      ) : (
        comments.map(comment => (
          <CommentItem 
            key={comment.id}
            name={comment.username} 
            date={formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })} 
            text={comment.text} 
            upvotes={comment.upvotes} 
            downvotes={comment.downvotes}
            onUpvote={() => handleUpvote(comment.id)}
            onDownvote={() => handleDownvote(comment.id)}
          />
        ))
      )}
    </div>
  );
}
