
// LoginForm.jsx
// This component shows an email + password form.
// When the user clicks Login:
//   1. We call the backend login API.
//   2. If it works: save user info in global state, go to the dashboard.
//   3. If it fails: show the error message on screen.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  // useNavigate gives us a function to redirect the user to another page.
  const navigate = useNavigate();

  // Get the full auth context object, then pick out only what we need.
  const authData = useAuth();
  const login = authData.login;

  // State for the two input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------------------------------
  // Handler functions for each input field.
  // These run every time the user types a character.
  // "event.target.value" is the current text inside the input box.
  // ----------------------------------------------------------------
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  // ----------------------------------------------------------------
  // handleSubmit — runs when the user clicks the Login button.
  // event.preventDefault() stops the browser from refreshing the page
  // (which is the old default HTML form behaviour).
  // ----------------------------------------------------------------
  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Build the data object to send. Write each field out explicitly.
      const formData = {
        email: email,
        password: password
      };

      // Send to backend. data comes back as { token, user: { name, email, role } }
      const data = await loginUser(formData);

      // Save user info and token in the global auth state.
      login(data.user, data.token);

      // Send the user to the right page based on their role.
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      // Check for a server error message step by step (no optional chaining).
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------------------------------------
  // Prepare display values before the return statement.
  // We avoid ternary operators and && shortcuts in JSX.
  // ----------------------------------------------------------------

  // Button label changes while loading
  let buttonText;
  if (loading) {
    buttonText = "Logging in...";
  } else {
    buttonText = "Login";
  }

  // Error box — only shown when error is not empty
  let errorBox = null;
  if (error !== "") {
    errorBox = <p className="error-message">{error}</p>;
  }

  return (
    <div className="form-container">
      <h2>Login</h2>

      {errorBox}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {buttonText}
        </button>

      </form>

      <p className="switch-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginForm;
