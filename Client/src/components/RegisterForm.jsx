// RegisterForm.jsx
// This component shows a sign-up form: name, email, password.
// When the user clicks Register:
//   1. We call the backend register API.
//   2. If it works: show a success message, then go to /login.
//   3. If it fails: show the error message on screen.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

function RegisterForm() {
  const navigate = useNavigate();

  // State for the three input fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ----------------------------------------------------------------
  // Handler functions for each input field.
  // ----------------------------------------------------------------
  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  // ----------------------------------------------------------------
  // handleSubmit — runs when the user clicks Register.
  // ----------------------------------------------------------------
  async function handleSubmit(event) {
    event.preventDefault();

    // Simple check before sending to the server
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Build the data object explicitly. No object shorthand.
      const formData = {
        name: name,
        email: email,
        password: password
      };

      await registerUser(formData);

      // Show success message, then redirect to /login after 1.5 seconds.
      setSuccessMessage("Account created! Redirecting to login...");
      setTimeout(function () {
        navigate("/login");
      }, 1500);

    } catch (err) {
      // Check for a server error message step by step.
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------------------------------------
  // Prepare display values before the return statement.
  // ----------------------------------------------------------------

  let buttonText;
  if (loading) {
    buttonText = "Creating account...";
  } else {
    buttonText = "Register";
  }

  let errorBox = null;
  if (error !== "") {
    errorBox = <p className="error-message">{error}</p>;
  }

  let successBox = null;
  if (successMessage !== "") {
    successBox = <p className="success-message">{successMessage}</p>;
  }

  return (
    <div className="form-container">
      <h2>Create an Account</h2>

      {errorBox}
      {successBox}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Alice Smith"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

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
            placeholder="Min. 6 characters"
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
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterForm;
