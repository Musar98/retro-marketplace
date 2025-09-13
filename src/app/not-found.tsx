"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          color: "#00ff00",
          textShadow: "0 0 5px #00ff00, 0 0 10px #00ff00",
          fontSize: "5rem",
          margin: 0,
        }}
      >
        404
      </h1>
      <p
        style={{
          color: "#cfcfcf",
          margin: "1rem 0 2rem 0",
          fontSize: "1.2rem",
        }}
      >
        Page not found
      </p>
      <Link
        href="/"
        style={{
          color: "#00ff00",
          textShadow: "0 0 5px #00ff00, 0 0 10px #00ff00",
          fontWeight: "bold",
          textDecoration: "none",
          fontSize: "1.2rem",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.textShadow =
            "0 0 10px #00ff00, 0 0 20px #00ff00";
          (e.target as HTMLElement).style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.textShadow =
            "0 0 5px #00ff00, 0 0 10px #00ff00";
          (e.target as HTMLElement).style.transform = "scale(1)";
        }}
      >
        Go back Home
      </Link>
    </main>
  );
}
