"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseClient } from "@/lib/SupabaseClient";
import { Review, Comment } from "@/app/Types";

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState<Review>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchReview = async () => {
    const { data } = await supabaseClient
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();
    setReview(data);
  };

  const fetchComments = async () => {
    const { data } = await supabaseClient
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
    if (data) setComments(data);
  };

  useEffect(() => {
    if (id) {
      void fetchReview();
      void fetchComments();
    }
  }, [id]);

  const addComment = async () => {
    if (!newComment.trim()) return;

    const { data, error } = await supabaseClient
      .from("comments")
      .insert([{ post_id: id, content: newComment }])
      .select();

    if (!error && data && data.length > 0) {
      setComments([...comments, data[0]]);
      setNewComment("");
    }
  };

  if (!review) return <p style={{ color: "#cfcfcf" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "60%", margin: "2rem auto", color: "#cfcfcf" }}>
      <h1 style={{ color: "#00ff00" }}>💬 Review</h1>
      <p>{review.content}</p>
      {review.rating && <p>Rating: {review.rating}/5</p>}

      <h2 style={{ marginTop: "2rem", color: "#00ff00" }}>💭 Comments</h2>
      {comments.length > 0 ? (
        comments?.map((c) => (
          <div
            key={c.id}
            style={{ borderBottom: "1px solid #333", padding: "0.5rem 0" }}
          >
            <p>{c.content}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      <textarea
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={{
          width: "100%",
          marginTop: "1rem",
          padding: "0.5rem",
          border: "1px solid #00ff00",
          background: "#0b0b0b",
          color: "#cfcfcf",
        }}
      />
      <button
        onClick={addComment}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          border: "1px solid #00ff00",
          color: "#00ff00",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Add Comment
      </button>
    </div>
  );
}
