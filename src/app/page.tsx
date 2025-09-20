"use client";
import { CSSProperties, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import MarketplaceListingCard from "@/components/MarketplaceListingCard";
import Link from "next/link";
import CreatePostButton from "@/components/CreatePostButton";
import { MarketplaceListing, Review } from "@/app/Types";
import ReviewPostCard from "@/components/ReviewPostCard";

export default function Home() {
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);
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
      .limit(3);

    if (!error && data) setMarketplaceListings(data as MarketplaceListing[]);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (!error && data) setReviews(data as Review[]);
  };

  const sectionStyle: CSSProperties = {
    margin: "0 auto 5rem auto",
    maxWidth: "60%",
    border: "2px dotted #00ff00",
    padding: "2rem",
    borderRadius: "8px",
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <section style={sectionStyle}>
        <h1 style={{ color: "#00ff00" }}>💬 Review Forum</h1>
        <CreatePostButton
          buttonText={"📝 Write review"}
          route={"/create-marketplaceListing?type=review"}
        />
        <p style={{ color: "#cfcfcf" }}>Trending Posts</p>
        <div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewPostCard review={review} key={review.id} />
            ))
          ) : (
            <p>No forum posts yet.</p>
          )}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/forum" style={{ color: "#00ff00", marginTop: "1rem" }}>
            → Go to Forum
          </Link>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ color: "#00ff00" }}>🛒 Marketplace</h2>

        <CreatePostButton
          buttonText={"💰 Buy / Sell / Seek"}
          route={"/create-marketplaceListing?type=marketplace"}
        />
        <p style={{ color: "#cfcfcf" }}>Trending listings</p>
        {marketplaceListings.length > 0 ? (
          marketplaceListings.map((marketplaceListing) => (
            <MarketplaceListingCard
              marketplaceListing={marketplaceListing}
              key={marketplaceListing.id}
            />
          ))
        ) : (
          <p>No posts yet. Be the first to post!</p>
        )}
        <div style={{ marginTop: "1rem" }}>
          <Link href="/marketplace" style={{ color: "#00ff00" }}>
            → Visit marketplace
          </Link>
        </div>
      </section>
    </div>
  );
}
