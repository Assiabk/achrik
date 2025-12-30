import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  // Check if user is authenticated and is an admin
  const isAuthenticated = token && adminUser.role === "Admin"; // <-- update here

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
