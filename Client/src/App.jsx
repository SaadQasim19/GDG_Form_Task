
// ============================================================
// App.jsx
// ------------------------------------------------------------
// This is the ROOT of our frontend app.
// It does two things:
//   1. Wraps everything in <AuthProvider> so every page can
//      access the global login state.
//   2. Defines all the URL routes using React Router.
//
// ROUTE MAP:
//   /               → redirect to /login
//   /login          → LoginForm  (public)
//   /register       → RegisterForm  (public)
//   /dashboard      → Dashboard  (must be logged in)
//   /admin          → AdminDashboard  (must be logged in + admin role)
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      {/* BrowserRouter enables URL-based navigation (like /login, /dashboard) */}
      <BrowserRouter>
        <Routes>

          {/* Visiting "/" automatically sends the user to "/login" */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public pages — anyone can visit these */}
          <Route path="/login"    element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected page — only logged-in users can visit */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin-only page — must be logged in AND have role "admin" */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
