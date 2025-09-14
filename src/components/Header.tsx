"use client";
import Link from "next/link";
import React from "react";
import { supabaseClient } from "@/lib/SupabaseClient";
import { useSupabaseUser } from "@/lib/useSupabaseuser";

export default function Header() {
  const user = useSupabaseUser();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <header
      className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "2px solid #00ff00",
      }}
    >
      <h1 style={{ color: "#00ff00", fontFamily: "var(--font-geist-mono)" }}>
        Retro Marketplace
      </h1>
      <nav>
        <ul
          style={{
            display: "flex",
            gap: "1rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link href="/" style={{ color: "#cfcfcf", textDecoration: "none" }}>
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/forum"
              style={{ color: "#cfcfcf", textDecoration: "none" }}
            >
              Forum
            </Link>
          </li>
          <li>
            <Link
              href="/marketplace"
              style={{ color: "#cfcfcf", textDecoration: "none" }}
            >
              Marketplace
            </Link>
          </li>

          {user ? (
            <>
              <li style={{ color: "#00ff00", alignSelf: "center" }}>
                {user.email}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "0.25rem 0.5rem",
                    background: "transparent",
                    color: "#00ff00",
                    border: "1px solid #00ff00",
                    cursor: "pointer",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/auth"
                style={{ color: "#00ff00", textDecoration: "none" }}
              >
                Login / Signup
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
