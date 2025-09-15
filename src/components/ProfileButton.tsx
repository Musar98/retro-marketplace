"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseClient } from "@/lib/SupabaseClient";

export default function ProfileButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email ?? null);

      const { data: prof } = await supabaseClient
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (prof?.avatar_url) {
        setAvatarUrl(prof.avatar_url);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  return (
    <button
      onClick={() => router.push("/profile")}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.25rem 0.5rem",
        background: "transparent",
        color: "#00ff00",
        border: "1px solid #00ff00",
        cursor: "pointer",
        fontFamily: "var(--font-geist-mono)",
        borderRadius: "9999px",
      }}
    >
      {avatarUrl ? (
        <>
          <Image
            src={avatarUrl}
            alt="User avatar"
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
            unoptimized
          />
          <p style={{ marginLeft: "0.5rem" }}>{email}</p>
        </>
      ) : (
        <span>{email}</span>
      )}
    </button>
  );
}
