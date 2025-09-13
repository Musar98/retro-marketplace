"use client";
import { useState } from "react";
import Image from "next/image";
import { supabaseClient } from "@/lib/SupabaseClient";

export default function AuthForm() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login handler
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  // Signup handler
  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    // 1️⃣ Create auth user
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("User not created properly.");
      setLoading(false);
      return;
    }

    const userId = data.user.id;
    let avatarUrl: string | null = null;

    // 2️⃣ Upload profile image if provided
    if (profileImage) {
      const ext = profileImage.name.split(".").pop();
      const fileName = `${userId}.${ext}`;
      const { error: uploadError } = await supabaseClient.storage
        .from("profile-images")
        .upload(fileName, profileImage, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabaseClient.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      avatarUrl = urlData.publicUrl;
    }

    // 3️⃣ Insert profile row with exact auth UID
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({
        id: userId, // this must match auth.uid() for RLS
        username,
        avatar_url: avatarUrl,
        bio: "",
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);
  };

  return (
    <div
      style={{
        padding: "2rem",
        border: "2px dotted #00ff00",
        borderRadius: "8px",
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        {["login", "signup"].map((t) => (
          <button
            key={t}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderBottom: tab === t ? "2px solid #00ff00" : "none",
              color: "#00ff00",
              background: "transparent",
              cursor: "pointer",
            }}
            onClick={() => setTab(t as "login" | "signup")}
          >
            {t === "login" ? "Login" : "Signup"}
          </button>
        ))}
      </div>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {tab === "login" ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
            Login
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <label
            htmlFor="profileImage"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              marginBottom: "1rem",
              padding: "1rem",
              border: "2px dashed #00ff00",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#cfcfcf",
              transition: "background 0.2s",
              minHeight: "120px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "black")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={120}
                  height={120}
                  style={{ borderRadius: "50%" }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "#ff0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </>
            ) : (
              "Click or drag to upload profile image"
            )}
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          <button onClick={handleSignup} disabled={loading} style={buttonStyle}>
            Signup
          </button>
        </>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "1rem",
  background: "#1e1e1e",
  color: "#cfcfcf",
  border: "1px solid #00ff00",
  borderRadius: "4px",
};

const buttonStyle = {
  width: "100%",
  padding: "0.5rem",
  background: "#00ff00",
  color: "#1e1e1e",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};
