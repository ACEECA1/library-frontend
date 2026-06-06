import { ReviewItem } from "./ReviewItem";

export function ReviewList() {
  return (
    <div className="space-y-4">
      <ReviewItem name="Engineer Kamel" date="2 days ago" rating={5} text="Excellent manual. The section on load distribution is particularly well-detailed and aligns perfectly with current building codes." badge="Top Reviewer" />
      <ReviewItem name="Prof. Ahmed" date="1 week ago" rating={4} text="Good overview but could use more recent case studies. Overall a solid resource." />
    </div>
  );
}
