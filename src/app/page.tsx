"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import PostCard from "@/components/PostCard";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  content: string;
  images?: string[];
  type: "BUY" | "SELL" | "LOOKING";
};

type Review = {
  id: string;
  content: string;
  rating?: number;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    void fetchPosts();
    void fetchReviews();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabaseClient
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3); // just preview

    if (!error && data) setPosts(data as Post[]);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3); // just preview

    if (!error && data) setReviews(data as Review[]);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {/* Forum section */}
      <section
        style={{
          margin: "0 auto 5rem auto",
          maxWidth: "60%",
          border: "2px dotted #00ff00",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ color: "#00ff00" }}>💬 Forum</h1>
        <p style={{ color: "#cfcfcf" }}>Trending Posts</p>
        <div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} style={{ marginBottom: "1rem" }}>
                <p>{review.content}</p>
                {review.rating && <p>Rating: {review.rating}/5</p>}
              </div>
            ))
          ) : (
            <p>No forum posts yet.</p>
          )}
        </div>
        <Link href="/forum" style={{ color: "#00ff00" }}>
          → Go to Forum
        </Link>
      </section>

      <section
        style={{
          margin: "0 auto 5rem auto",
          maxWidth: "60%",
          border: "2px dotted #00ff00",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ color: "#00ff00" }}>🛒 Marktplatz</h2>
        <p style={{ color: "#cfcfcf" }}>Trending listings</p>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>No posts yet. Be the first to post!</p>
        )}
        <Link href="/marketplace" style={{ color: "#00ff00" }}>
          → Visit marketplace
        </Link>
      </section>
    </div>
  );
}
