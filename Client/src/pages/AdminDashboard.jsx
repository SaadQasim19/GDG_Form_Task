
// AdminDashboard.jsx  (Admin-Only Dashboard)
// Only users with role "admin" can reach this page.
// The ProtectedRoute component blocks everyone else.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/authApi";

function AdminDashboard() {
  const navigate = useNavigate();

  // Get the full auth context object, then pick out what we need.
  const authData = useAuth();
  const user = authData.user;
  const token = authData.token;
  const logout = authData.logout;

  async function handleLogout() {
    try {
      await logoutUser(token);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      navigate("/login");
    }
  }

  // Read user fields safely with an explicit null check.
  let userName = "";
  let userEmail = "";
  let userRole = "";

  if (user !== null) {
    userName  = user.name;
    userEmail = user.email;
    userRole  = user.role;
  }

  return (
    <div className="dashboard-container admin">
      <h1>Admin Dashboard</h1>
      <p>Hello, <strong>{userName}</strong>. You have admin access.</p>

      <div className="info-card">
        <h3>Admin Profile</h3>
        <p><strong>Name:</strong>  {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Role:</strong>  {userRole}</p>
      </div>

      <div className="admin-note">
        <h3>Admin Privileges</h3>
        <ul>
          <li>Access all protected routes</li>
          <li>View the admin-only API endpoint</li>
          <li>Manage users (future feature)</li>
        </ul>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
