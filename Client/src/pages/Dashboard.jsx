// Dashboard.jsx  (User Dashboard)
// This is the page a regular logged-in user sees after login.
// It shows their name, email, and role, plus a Logout button.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/authApi";

function Dashboard() {
  const navigate = useNavigate();

  // Get the full auth context object, then pick out what we need.
  const authData = useAuth();
  const user = authData.user;
  const token = authData.token;
  const logout = authData.logout;

  // ----------------------------------------------------------------
  // handleLogout — tells the backend, then clears local state.
  // Even if the backend call fails, we still log the user out locally.
  // ----------------------------------------------------------------
  async function handleLogout() {
    try {
      await logoutUser(token);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();            // clear the global auth state
      navigate("/login");  // go back to the login page
    }
  }

  // ----------------------------------------------------------------
  // Read user fields safely.
  // Dashboard is protected, so user will never be null here.
  // We still check to be explicit and clear about what is happening.
  // ----------------------------------------------------------------
  let userName = "";
  let userEmail = "";
  let userRole = "";

  if (user !== null) {
    userName  = user.name;
    userEmail = user.email;
    userRole  = user.role;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {userName}!</h1>
      <p>You are logged in as a <strong>{userRole}</strong>.</p>

      <div className="info-card">
        <h3>Your Profile Info</h3>
        <p><strong>Name:</strong>  {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Role:</strong>  {userRole}</p>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
