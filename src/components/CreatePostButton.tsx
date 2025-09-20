import { useRouter } from "next/navigation";
import { CSSProperties, FC } from "react";

type CreatePostButtonProps = {
  buttonText: string;
  route: string;
};

const CreatePostButton: FC<CreatePostButtonProps> = ({
  buttonText,
  route,
}) => {
  const router = useRouter();

  const buttonStyle: CSSProperties = {
    padding: "0.5rem 1rem",
    margin:"1rem 0 1rem 0",
    color: "#00ff00",
    border: "2px solid #00ff00",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 0 12px #00ff00",
  };

  return (
    <button
      style={buttonStyle}
      onClick={() => router.push(route)}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 0 20px #00ff00")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 0 12px #00ff00")
      }
    >
      {buttonText}
    </button>
  );
};

export default CreatePostButton;
