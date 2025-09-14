import { CSSProperties } from "react";

export const containerStyle: CSSProperties = {
  padding: "2rem",
  border: "2px solid #00ff00",
  borderRadius: 8,
  backgroundColor: "#1e1e1e",
  maxWidth: 600,
  margin: "2rem auto",
};
export const titleStyle: CSSProperties = {
  color: "#00ff00",
  fontSize: "1.5rem",
  marginBottom: "1rem",
};
export const subTitleStyle: CSSProperties = {
  color: "#00ff00",
  marginBottom: "0.5rem",
};
export const inputStyle: CSSProperties = {
  padding: "0.3rem",
  border: "1px solid #00ff00",
  background: "#1e1e1e",
  color: "#cfcfcf",
  marginLeft: "0.5rem",
};
export const uploadLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  position: "relative",
  marginBottom: 12,
  padding: 12,
  border: "2px dashed #00ff00",
  borderRadius: 8,
  cursor: "pointer",
  color: "#cfcfcf",
  minHeight: 120,
};
export const removeButtonStyle: CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  background: "#ff4d4d",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: 26,
  height: 26,
  cursor: "pointer",
};
export const saveButtonStyle: CSSProperties = {
  marginTop: "1rem",
  padding: "0.6rem 1rem",
  background: "#00ff00",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
  color: "#0b0b0b",
};