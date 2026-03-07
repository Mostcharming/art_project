import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { useUserStore } from "../store";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const user = useUserStore((s) => s.user);
  console.log("ProtectedRoute user:", user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}
