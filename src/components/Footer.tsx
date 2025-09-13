import React from "react";

export default function Footer() {
    return (
        <footer
            style={{
                marginTop: "auto",
                padding: "1rem 2rem",
                backgroundColor: "#1e1e1e",
                borderTop: "2px solid #00ff00",
                display: "flex",
                justifyContent: "center",
                color: "#cfcfcf",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.9rem",
            }}
        >
            &copy; {new Date().getFullYear()} Retro Marketplace. All rights reserved.
        </footer>
    );
}
