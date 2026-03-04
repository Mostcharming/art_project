import type { JSX } from "react";
import { useUserStore } from "../store";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const user = useUserStore((s) => s.user);
  console.log("ProtectedRoute user:", user);

  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
}
