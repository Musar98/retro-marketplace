type LoadingProps = {
  loadingText?: string;
};

export default function Loading({ loadingText = "Loading..." }: LoadingProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10%",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          color: "#00ff00",
          backgroundColor: "#0b0b0b",
          padding: "0.75rem 1.25rem",
          border: "1px solid #00ff00",
          borderRadius: "6px",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            overflow: "hidden",
            animation: "typing 2s steps(20, end) infinite alternate",
          }}
        >
          {loadingText}
        </span>
        <span
          style={{
            display: "inline-block",
            width: "0.6rem",
            height: "1rem",
            marginLeft: "0.3rem",
            backgroundColor: "#00ff00",
            animation: "blink 1s step-end infinite",
          }}
        ></span>

        <style>
          {`
            @keyframes blink {
              from, to { background-color: transparent; }
              50% { background-color: #00ff00; }
            }
            @keyframes typing {
              from { width: 0; }
              to { width: 100%; }
            }
          `}
        </style>
      </div>
    </div>
  );
}
