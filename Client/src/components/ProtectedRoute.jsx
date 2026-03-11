// ============================================================
// ProtectedRoute.jsx
// ------------------------------------------------------------
// A "route guard" — a wrapper that checks if the user is
// allowed to see a certain page BEFORE showing it.
//
// HOW IT WORKS:
//   • Wrap any page with <ProtectedRoute> in App.jsx.
//   • If the user is NOT logged in → they are sent to /login.
//   • If a "requiredRole" is given (e.g. "admin") and the user
//     doesn't have that role → they are sent to /dashboard.
//   • Otherwise → show the page normally.
//
// EXAMPLE USAGE in App.jsx:
//   <ProtectedRoute>
//     <Dashboard />
//   </ProtectedRoute>
//
//   <ProtectedRoute requiredRole="admin">
//     <AdminDashboard />
//   </ProtectedRoute>
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute receives two things via props:
//   props.children    — the page component to show if access is allowed
//   props.requiredRole — optional, e.g. "admin". If given, user must have this role.
function ProtectedRoute(props) {
  const children = props.children;
  const requiredRole = props.requiredRole;

  // Read auth state from the global storage box.
  const authData = useAuth();
  const isLoggedIn = authData.isLoggedIn;
  const user = authData.user;

  // ----------------------------------------------------------
  // Check 1: Is the user logged in?
  // If not, send them to /login.
  // "replace" means the browser back button won't return here.
  // ----------------------------------------------------------
  if (isLoggedIn === false) {
    return <Navigate to="/login" replace />;
  }

  // ----------------------------------------------------------
  // Check 2: Does this route need a specific role?
  // requiredRole is "admin" for the admin page, or undefined for regular pages.
  // ----------------------------------------------------------
  if (requiredRole !== undefined) {
    // The user exists (we are logged in) but check the role explicitly.
    if (user.role !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ----------------------------------------------------------
  // All checks passed — show the actual page.
  // ----------------------------------------------------------
  return children;
}

export default ProtectedRoute;
