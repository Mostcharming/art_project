import { useContext } from "react";
import { ModerationContext } from "./ModerationContext";

export function useModeration() {
  const context = useContext(ModerationContext);
  if (!context) {
    throw new Error("useModeration must be used within ModerationProvider");
  }
  return context;
}
