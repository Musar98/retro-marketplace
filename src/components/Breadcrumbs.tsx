"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label =
      segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    return { href, label };
  });

  return (
    <nav
      aria-label="breadcrumb"
      style={{
        fontSize: "0.9rem",
        marginBottom: "1.5rem",
        padding: "0.5rem 1rem",
        border: "2px dashed #00ff00",
        borderRadius: "6px",
        display: "inline-block",
      }}
    >
      {segments.length === 0 ? (
        <span
          style={{
            color: "#00ff00",
            fontWeight: "bold",
            textShadow: "0 0 8px #00ff00",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.textShadow =
              "0 0 10px #00ff00, 0 0 15px #00ff00";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.textShadow =
              "0 0 5px #00ff00";
          }}
        >
          Home
        </span>
      ) : (
        <Link
          href="/"
          style={{
            color: "#00ff00",
            textDecoration: "none",
            textShadow: "0 0 5px #00ff00",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.textShadow =
              "0 0 10px #00ff00, 0 0 15px #00ff00";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.textShadow =
              "0 0 5px #00ff00";
          }}
        >

          Home
        </Link>
      )}

      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={idx} style={{ marginLeft: "0.3rem" }}>
            <span style={{ color: "#00ff00" }}>▸</span>{" "}
            {isLast ? (
              <span
                style={{
                  color: "#00ff00",
                  fontWeight: "bold",
                  textShadow: "0 0 8px #00ff00",
                  textDecoration: "underline",
                }}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                style={{
                  color: "white",
                  textDecoration: "none",
                  textShadow: "0 0 5px #00ff00",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.textShadow =
                    "0 0 10px #00ff00, 0 0 15px #00ff00";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.textShadow =
                    "0 0 5px #00ff00";
                }}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
