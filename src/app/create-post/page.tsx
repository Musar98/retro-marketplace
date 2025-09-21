"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/SupabaseClient";
import { MarketplaceListingType } from "@/app/Types";

type PostType = "review" | "marketplace";

const MAX_IMAGES = 3; // 👈 easy to change later

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [postType, setPostType] = useState<PostType | null>(null);
  const [marketplaceListingType, setMarketplaceListingType] =
    useState<MarketplaceListingType>("SELL");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const typeParam = searchParams.get("type") as PostType | null;
    if (!typeParam || (typeParam !== "review" && typeParam !== "marketplace")) {
      router.push("/");
    } else {
      setPostType(typeParam);
    }
  }, [searchParams, router]);

  if (!postType) return null;

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files);

    if (imageFiles.length + selected.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images`);
      return;
    }

    setImageFiles((prev) => [...prev, ...selected]);
  };

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const imageUrls: string[] = [];

      if (postType === "marketplace") {
        const { data: listing, error: postErr } = await supabaseClient
          .from("listings")
          .insert([
            {
              title,
              content,
              type: marketplaceListingType,
              user_id: user.id,
              images: [],
            },
          ])
          .select()
          .single();

        if (postErr) throw postErr;

        if (imageFiles.length > 0) {
          for (const file of imageFiles) {
            const ext = file.name.split(".").pop();
            const filePath = `${user.id}/${listing.id}/${Date.now()}-${Math.random()
              .toString(36)
              .substring(2)}.${ext}`;

            const { error: uploadErr } = await supabaseClient.storage
              .from("marketplaceListing-images")
              .upload(filePath, file);

            if (uploadErr) throw uploadErr;

            const {
              data: { publicUrl },
            } = supabaseClient.storage
              .from("marketplaceListing-images")
              .getPublicUrl(filePath);

            imageUrls.push(publicUrl);
          }

          await supabaseClient
            .from("listings")
            .update({ images: imageUrls })
            .eq("id", listing.id);
        }
      } else {
        const { error: reviewErr } = await supabaseClient
          .from("reviews")
          .insert([{ title, content, user_id: user.id }]);
        if (reviewErr) throw reviewErr;
      }

      setMessage("Post created successfully!");
      setTitle("");
      setContent("");
      setImageFiles([]);
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "2rem",
        border: "2px dotted #00ff00",
        borderRadius: 8,
        backgroundColor: "#0b0b0b",
        color: "#cfcfcf",
        fontFamily: "var(--font-geist-mono)",
      }}
    >
      <h1 style={{ color: "#00ff00", marginBottom: "1rem" }}>
        {postType === "review"
          ? "💬 Write a Review"
          : "🛒 Create Marketplace Post"}
      </h1>

      {postType === "marketplace" && (
        <>
          <select
            value={marketplaceListingType}
            onChange={(e) =>
              setMarketplaceListingType(
                e.target.value as MarketplaceListingType,
              )
            }
            style={{
              width: "100%",
              marginBottom: 12,
              padding: "0.5rem",
              border: "1px solid #00ff00",
              borderRadius: 4,
              background: "#0b0b0b",
              color: "#cfcfcf",
            }}
          >
            <option value="BUY">🛍️ Buying</option>
            <option value="SELL">💰 Selling</option>
            <option value="LOOKING">🔍 Looking for</option>
          </select>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
            style={{
              marginBottom: 12,
              background: "#0b0b0b",
              color: "#cfcfcf",
              padding: 12,
              border: "2px dashed #00ff00",
              borderRadius: 8,
            }}
          />

          {imageFiles.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              {imageFiles.map((file, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    width: 100,
                    height: 100,
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${i}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      border: "1px solid #00ff00",
                      borderRadius: 4,
                    }}
                  />
                  <button
                    onClick={() =>
                      setImageFiles((prev) =>
                        prev.filter((_, index) => index !== i),
                      )
                    }
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#ff4d4d",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      color: "#fff",
                      fontSize: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 12,
          padding: "0.5rem",
          border: "1px solid #00ff00",
          borderRadius: 4,
          background: "#0b0b0b",
          color: "#cfcfcf",
        }}
      />

      <textarea
        placeholder="Your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          minHeight: 120,
          padding: "0.5rem",
          border: "1px solid #00ff00",
          borderRadius: 4,
          background: "#0b0b0b",
          color: "#cfcfcf",
          marginBottom: 12,
        }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            background: "#0b0b0b",
            color: "#00ff00",
            border: "2px solid #00ff00",
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "var(--font-geist-mono)",
            boxShadow: loading ? "0 0 12px #00ff00" : "none",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
          }}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {error && <p style={{ color: "#ff4d4d", marginTop: 8 }}>{error}</p>}
      {message && <p style={{ color: "#00ff00", marginTop: 8 }}>{message}</p>}
    </div>
  );
}
