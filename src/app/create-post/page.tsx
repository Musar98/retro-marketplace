"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/SupabaseClient";

type PostType = "review" | "marketplace";

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [postType, setPostType] = useState<PostType | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const handleFileChange = (file: File) => setImageFile(file);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) throw new Error("Not logged in");

      let imageUrl: string | null = null;

      if (imageFile && postType === "marketplace") {
        const ext = imageFile.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabaseClient.storage
          .from("post-images")
          .upload(filePath, imageFile, { upsert: true });
        if (uploadErr) throw uploadErr;

        const { data } = supabaseClient.storage
          .from("post-images")
          .getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      if (postType === "review") {
        const { error: reviewErr } = await supabaseClient
          .from("reviews")
          .insert([{ title, content, user_id: user.id }]);
        if (reviewErr) throw reviewErr;
      } else {
        const { error: postErr } = await supabaseClient
          .from("listings")
          .insert([
            {
              title,
              content,
              user_id: user.id,
              images: imageUrl ? [imageUrl] : [],
            },
          ]);
        if (postErr) throw postErr;
      }

      setMessage("Post created successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
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

      {postType === "marketplace" && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleFileChange(e.target.files[0])
          }
          style={{ marginBottom: 12 }}
        />
      )}

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
          transition: "box-shadow 0.2s ease",
        }}
      >
        {loading ? "Posting..." : "Post"}
      </button>

      {error && <p style={{ color: "#ff4d4d", marginTop: 8 }}>{error}</p>}
      {message && <p style={{ color: "#00ff00", marginTop: 8 }}>{message}</p>}
    </div>
  );
}
