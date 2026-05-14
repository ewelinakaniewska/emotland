import { Navigate, useLocation } from "react-router-dom";
import SpinnerFullscreen from "../components/SpinnerFullscreen";
import { useAuth } from "./useAuth";

export default function RequireAuth({ children, roles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <SpinnerFullscreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
