"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Review } from "@/app/Types";
import ReviewPostCard from "@/components/ReviewPostCard";

export default function ForumPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    void fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReviews(data as Review[]);
  };

  return (
    <div style={{ margin: "2rem auto", maxWidth: "60%" }}>
      <Breadcrumbs />
      <h1 style={{ color: "#00ff00", marginBottom: "1rem", fontSize: "2rem" }}>
        💬 Forum
      </h1>
      <p style={{ color: "#cfcfcf", marginBottom: "2rem" }}>
        Reviews & product discussions
      </p>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewPostCard review={review} key={review.id} />
        ))
      ) : (
        <p>No forum posts yet.</p>
      )}
    </div>
  );
}
