"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/SupabaseClient";

export default function AuthForm() {
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------- SIGNUP ----------
  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: signUpErr } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (signUpErr) throw signUpErr;

      setMessage(
        "Signup successful — check your email to confirm your account.",
      );
      router.push("/profile");
    } catch (err: any) {
      setError(err.message ?? "Unexpected error during signup");
    } finally {
      setLoading(false);
    }
  };

  // ---------- LOGIN ----------
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: signInErr } = await supabaseClient.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (signInErr) throw signInErr;

      router.push("/profile");
    } catch (err: any) {
      setError(err.message ?? "Unexpected error during login");
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div
      style={{
        padding: "2rem",
        border: "2px dotted #00ff00",
        borderRadius: 8,
        backgroundColor: "#1e1e1e",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: 16 }}>
        <button
          onClick={() => setTab("login")}
          style={{
            flex: 1,
            padding: 8,
            borderBottom: tab === "login" ? "2px solid #00ff00" : "none",
            color: "#00ff00",
            background: "transparent",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setTab("signup")}
          style={{
            flex: 1,
            padding: 8,
            borderBottom: tab === "signup" ? "2px solid #00ff00" : "none",
            color: "#00ff00",
            background: "transparent",
          }}
        >
          Signup
        </button>
      </div>

      {message && (
        <div style={{ color: "#00ff00", marginBottom: 12 }}>{message}</div>
      )}
      {error && (
        <div style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</div>
      )}

      {tab === "login" ? (
        <>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
            type="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
            type="password"
          />
          <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
            {loading ? "Working..." : "Login"}
          </button>
        </>
      ) : (
        <>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={inputStyle}
            type="text"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
            type="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
            type="password"
          />

          <button onClick={handleSignup} disabled={loading} style={buttonStyle}>
            {loading ? "Working..." : "Signup"}
          </button>
        </>
      )}
    </div>
  );
}

/* styles */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  marginBottom: 12,
  background: "#1e1e1e",
  color: "#cfcfcf",
  border: "1px solid #00ff00",
  borderRadius: 6,
};
const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  background: "#00ff00",
  color: "#0b0b0b",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "700",
};
