import { CommentItem } from "./CommentItem";

export function CommentList() {
  return (
    <div className="space-y-4">
      <CommentItem name="Student Ali" date="3 hours ago" text="Does anyone know if this covers the 2024 updates to the seismic design guidelines?" upvotes={12} downvotes={2} />
      <CommentItem name="Eng. Youssef" date="1 day ago" text="Yes, it touches on them briefly in chapter 4, but for a deep dive you might want to look at the specialized geotechnical manuals." upvotes={34} downvotes={0} />
    </div>
  );
}
