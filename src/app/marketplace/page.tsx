"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import PostCard from "@/components/PostCard";
import Breadcrumbs from "@/components/Breadcrumbs";

type Post = {
  id: string;
  title: string;
  content: string;
  images?: string[];
  type: "BUY" | "SELL" | "LOOKING";
  created_at: string;
};

export default function MarketplacePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    void fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabaseClient
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data as Post[]);
  };

  return (
    <div style={{ margin: "2rem auto", maxWidth: "60%" }}>
      <Breadcrumbs />
      <h1 style={{ color: "#00ff00", marginBottom: "1rem" }}>🛒 Marketplace</h1>
      <p style={{ color: "#cfcfcf", marginBottom: "2rem" }}>
        Buy, sell & trade posts
      </p>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No marketplace posts yet. Be the first to post!</p>
      )}
    </div>
  );
}
