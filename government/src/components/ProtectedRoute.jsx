import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any route that needs a logged-in user. `allowedRoles` restricts it
// further (e.g. only OFFICER/GOVT can see the dashboard).
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}