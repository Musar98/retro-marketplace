"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import PostCard from "../components/PostCard";

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
      .from<"posts", Post>("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabaseClient
      .from<"reviews", Review>("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReviews(data);
  };

  return (
    <div className="" style={{ marginTop: "2rem" }}>
      <section
        style={{
          marginRight: "auto",
          marginLeft: "auto",
          marginBottom: "5rem",
          maxWidth: "50%",
          border: "2px dotted #00ff00",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <h1 className="">Reviews Summary</h1>
        <div className="">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="">
              <p className="">{review.content}</p>
              {review.rating && <p className="">Rating: {review.rating}/5</p>}
            </div>
          ))}
        </div>
        <a href="/reviews" className="">
          View All Reviews
        </a>
      </section>

      <section
        style={{
          marginRight: "auto",
          marginLeft: "auto",
          marginBottom: "5rem",
          maxWidth: "50%",
          border: "2px dotted #00ff00",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <h2 className="">Marketplace</h2>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>No posts yet. Be the first to post!</p>
        )}
      </section>
    </div>
  );
}
