import Link from "next/link";
import { Review } from "@/app/Types";

type ReviewPostCardProps = {
  review: Review;
};

export default function ReviewPostCard({ review }: ReviewPostCardProps) {
  return (
    <div
      style={{
        borderBottom: "1px dashed #00ff00",
        padding: "1rem 0",
      }}
    >
      <Link
        href={`/forum/${review.id}`}
        style={{ color: "#00ff00", textDecoration: "none" }}
      >
        <p>{review.content}</p>
      </Link>
      {review.rating && <p>Rating: {review.rating}/5</p>}
      <small style={{ color: "#888" }}>
        {new Date(review.created_at).toLocaleString()}
      </small>
    </div>
  );
}
