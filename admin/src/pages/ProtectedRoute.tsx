import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const user = useUserStore((s) => s.user);
  if (!user) return <Navigate to="/" replace />;
  return children;
}
