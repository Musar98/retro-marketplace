"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseClient } from "@/lib/SupabaseClient";
import { MarketplaceListing, Comment } from "@/app/Types";
import Image from "next/image";

export default function MarketplaceDetailPage() {
  const { id } = useParams();
  const [marketplaceListing, setMarketplaceListing] =
    useState<MarketplaceListing>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      void fetchListing();
      void fetchComments();
    }
  }, [id]);

  const fetchListing = async () => {
    const { data, error } = await supabaseClient
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setMarketplaceListing(data);
  };

  const fetchComments = async () => {
    const { data } = await supabaseClient
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (data) setComments(data);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    const { data, error } = await supabaseClient
      .from("comments")
      .insert([{ post_id: id, content: newComment }]);

    if (!error && data) {
      setComments([...comments, data[0]]);
      setNewComment("");
    }
  };

  if (!marketplaceListing)
    return <p style={{ color: "#cfcfcf" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "60%", margin: "2rem auto", color: "#cfcfcf" }}>
      <h1 style={{ color: "#00ff00" }}>🛒 {marketplaceListing.title}</h1>
      <p>{marketplaceListing.content}</p>
      {marketplaceListing.type && (
        <p>
          <strong>Type:</strong> {marketplaceListing.type}
        </p>
      )}
      {marketplaceListing &&
        marketplaceListing.images &&
        marketplaceListing.images.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            {marketplaceListing.images.map((img: string, i: number) => (
              <Image
                key={i}
                src={img}
                alt={`Listing image ${i + 1}`}
                style={{
                  maxWidth: "100%",
                  marginBottom: "1rem",
                  border: "1px solid #00ff00",
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>
        )}

      <h2 style={{ marginTop: "2rem", color: "#00ff00" }}>💭 Comments</h2>
      {comments.length > 0 ? (
        comments.map((c) => (
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
