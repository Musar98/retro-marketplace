"use client";
import React from "react";
import AuthForm from "@/components/AuthForm";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AuthPage() {
  return (
    <div style={{ margin: "2rem auto", maxWidth: "400px" }}>
      <Breadcrumbs />
      <h1
        style={{
          color: "#00ff00",
          marginBottom: "1rem",
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        🔑 Login / Signup
      </h1>
      <AuthForm />
    </div>
  );
}
