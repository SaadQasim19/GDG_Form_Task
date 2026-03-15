
// authApi.js
// This is the only file that talks to the backend server.
// We use "axios" which is a library that makes it easy to
// send HTTP requests (like submitting a form to the server).

import axios from "axios";

// The base URL of our backend server.
// We will add the specific path (like "/register") at the end.
const BASE_URL = "http://localhost:5000/api/auth";

// ----------------------------------------------------------------
// registerUser
// ----------------------------------------------------------------
// Sends the new user's name, email, and password to the backend.
// The backend creates the account and sends back a success message.
// ----------------------------------------------------------------
export async function registerUser(formData) {
  const url = BASE_URL + "/register";
  const response = await axios.post(url, formData, {
    withCredentials: true
  });
  return response.data;
}

// ----------------------------------------------------------------
// loginUser
// ----------------------------------------------------------------
// Sends the user's email and password to the backend.
// The backend checks them and sends back: { token, user }
// where user = { name, email, role }
// ----------------------------------------------------------------
export async function loginUser(formData) {
  const url = BASE_URL + "/login";
  const response = await axios.post(url, formData, {
    withCredentials: true
  });
  return response.data;
}

// ----------------------------------------------------------------
// logoutUser
// ----------------------------------------------------------------
// Tells the backend that this user is logging out.
// We must send the token in the header so the backend knows who.
// The header format the backend expects: "Bearer <the token>"
// ----------------------------------------------------------------
export async function logoutUser(token) {
  const url = BASE_URL + "/logout";

  // Build the headers object step by step (no shortcuts)
  const requestHeaders = {
    Authorization: "Bearer " + token
  };

  const response = await axios.post(url, {}, { headers: requestHeaders });
  return response.data;
}

// ----------------------------------------------------------------
// getUserProfile
// ----------------------------------------------------------------
// Fetches the profile of whoever owns the given token.
// ----------------------------------------------------------------
export async function getUserProfile(token) {
  const url = BASE_URL + "/profile";

  const requestHeaders = {
    Authorization: "Bearer " + token
  };

  const response = await axios.get(url, { headers: requestHeaders });
  return response.data;
}
