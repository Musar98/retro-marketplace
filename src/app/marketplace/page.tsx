"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import MarketplaceListingCard from "@/components/MarketplaceListingCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MarketplaceListing } from "@/app/Types";

export default function MarketplacePage() {
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);

  useEffect(() => {
    void fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabaseClient
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setMarketplaceListings(data as MarketplaceListing[]);
  };

  return (
    <div style={{ margin: "2rem auto", maxWidth: "60%" }}>
      <Breadcrumbs />
      <h1 style={{ color: "#00ff00", marginBottom: "1rem" }}>🛒 Marketplace</h1>
      <p style={{ color: "#cfcfcf", marginBottom: "2rem" }}>
        Buy, sell & trade posts
      </p>
      {marketplaceListings.length > 0 ? (
        marketplaceListings.map((marketplaceListing) => (
          <MarketplaceListingCard key={marketplaceListing.id} marketplaceListing={marketplaceListing} />
        ))
      ) : (
        <p>No marketplace posts yet. Be the first to post!</p>
      )}
    </div>
  );
}
