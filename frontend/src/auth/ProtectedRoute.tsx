import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactElement } from "react";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
