import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <header
            className="header"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 2rem",
                backgroundColor: "#1e1e1e",
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
                        <a
                            href="/reviews"
                            style={{ color: "#cfcfcf", textDecoration: "none" }}
                        >
                            Reviews
                        </a>
                    </li>
                    <li>
                        <a
                            href="/marketplace"
                            style={{ color: "#cfcfcf", textDecoration: "none" }}
                        >
                            Marketplace
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
