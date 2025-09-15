"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    void fetchPosts();
    void fetchReviews();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabaseClient
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (!error && data) setPosts(data as Post[]);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (!error && data) setReviews(data as Review[]);
  };

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    padding: "0.5rem 1rem",
    color: "#00ff00",
    border: "2px solid #00ff00",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 0 12px #00ff00",
  };

  const sectionStyle: React.CSSProperties = {
    margin: "0 auto 5rem auto",
    maxWidth: "60%",
    border: "2px dotted #00ff00",
    padding: "2rem",
    borderRadius: "8px",
    position: "relative",
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <section style={sectionStyle}>
        <h1 style={{ color: "#00ff00" }}>💬 Review Forum</h1>
        <button
          style={buttonStyle}
          onClick={() => router.push("/create-post?type=review")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 20px #00ff00")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 12px #00ff00")
          }
        >
          📝 Write review
        </button>
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

      <section style={sectionStyle}>
        <h2 style={{ color: "#00ff00" }}>🛒 Marketplace</h2>
        <button
          style={buttonStyle}
          onClick={() => router.push("/create-post?type=marketplace")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 20px #00ff00")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 12px #00ff00")
          }
        >
          💰 Buy / Sell / Seek
        </button>
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
