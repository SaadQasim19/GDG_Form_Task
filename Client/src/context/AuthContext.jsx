// ============================================================
// AuthContext.jsx
// ------------------------------------------------------------
// Think of this file as a "global storage box" for our app.
// Anything stored here (like the logged-in user info or token)
// can be read from ANY component in the whole app — no need to
// pass props down manually through every parent/child.
//
// HOW IT WORKS (simple version):
//   1. We create a "Context" (the storage box).
//   2. We wrap our whole app inside a "Provider" (the box lid).
//   3. Any component can call useAuth() to read from the box.
// ============================================================

import { createContext, useContext, useState } from "react";

// Step 1 — Create the empty storage box.
// We export it so ProtectedRoute can also use it if needed.
const AuthContext = createContext();

// ============================================================
// AuthProvider — the wrapper that gives every child component
// access to the shared auth state.
// ============================================================
// AuthProvider accepts "props" — React passes { children } inside props.
// props.children is everything wrapped inside <AuthProvider>...</AuthProvider>.
export function AuthProvider(props) {

  // ── On first page load, check if the user was already logged in.
  // localStorage is like the browser's own notepad — it survives a refresh.
  // We saved the user & token there when they logged in last time.
  const [user, setUser] = useState(function () {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      return JSON.parse(savedUser);  // bring back the saved user object
    }
    return null;
  });

  const [token, setToken] = useState(function () {
    return localStorage.getItem('authToken') || null;  // bring back the saved token
  });

  // ----------------------------------------------------------
  // login() — call this after a successful login API response.
  // Pass in the user object and the JWT token from the server.
  // ----------------------------------------------------------
  function login(userData, jwtToken) {
    setUser(userData);   // save user info  e.g. { name: "Alice", role: "admin" }
    setToken(jwtToken);  // save the token  e.g. "eyJhbGciOiJIUzI1NiIsIn..."

    // Also write to localStorage so the data survives a page refresh.
    localStorage.setItem('authUser',  JSON.stringify(userData));
    localStorage.setItem('authToken', jwtToken);
  }

  // ----------------------------------------------------------
  // logout() — clears everything so the user is logged out.
  // ----------------------------------------------------------
  function logout() {
    setUser(null);
    setToken(null);

    // Remove saved data from localStorage so the user is fully signed out.
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  }

  // isLoggedIn — true when the user has a token, false otherwise.
  let isLoggedIn;
  if (token !== null) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  // Build the value object explicitly — no shorthand allowed.
  // This is what any component gets when they call useAuth().
  const contextValue = {
    user: user,
    token: token,
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

// ============================================================
// useAuth — a tiny custom hook so components don't have to
// import both useContext AND AuthContext every time.
//
// Usage inside any component:
//   const { user, isLoggedIn, login, logout } = useAuth();
// ============================================================
export function useAuth() {
  return useContext(AuthContext);
}
