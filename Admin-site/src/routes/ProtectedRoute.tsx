import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props): JSX.Element {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
