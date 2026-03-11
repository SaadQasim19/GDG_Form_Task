# Frontend Guide — For the Backend Developer

> This document explains how the frontend is structured, what data it sends to the backend, and exactly what shape of response it expects back. Read this before building any API endpoint.

---

## 1. Project Structure

```
Client/src/
├── api/
│   └── authApi.js          ← Every HTTP call to the backend lives here
├── context/
│   └── AuthContext.jsx     ← Global state: stores the logged-in user + JWT token
├── components/
│   ├── LoginForm.jsx        ← Login form UI + logic
│   ├── RegisterForm.jsx     ← Register form UI + logic
│   └── ProtectedRoute.jsx  ← Blocks pages from unauthenticated users
├── pages/
│   ├── Dashboard.jsx        ← Regular user's home page (after login)
│   └── AdminDashboard.jsx  ← Admin-only page
└── App.jsx                  ← All URL routes defined here
```

---

## 2. Backend Base URL (where the frontend points)

All API calls go to:

```
http://localhost:5000/api/auth
```

This is set in `src/api/authApi.js`:

```js
const BASE_URL = "http://localhost:5000/api/auth";
```

**Make sure your Express server runs on port `5000`.**  
If you use a different port, update `BASE_URL` in that file.

---

## 3. API Endpoints the Frontend Uses

### 3.1 — Register

| Detail | Value |
|--------|-------|
| Method | `POST` |
| URL | `/api/auth/register` |
| Auth required | No |

**Request body the frontend sends:**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "secret123"
}
```

**What the frontend does with the response:**  
It only checks that the request succeeded (status `2xx`). It does **not** read any specific field from the response body — it just redirects the user to `/login`.

**Recommended success response (any of these works):**
```json
{ "message": "User registered successfully" }
```

**On failure, send:**
```json
{ "message": "Email already in use" }
```
The frontend displays `error.response.data.message` directly to the user.

---

### 3.2 — Login

| Detail | Value |
|--------|-------|
| Method | `POST` |
| URL | `/api/auth/login` |
| Auth required | No |

**Request body the frontend sends:**
```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Response the frontend REQUIRES — this shape is mandatory:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

> ⚠️ **Critical:** The frontend reads `data.token` and `data.user.role` directly. If either field is missing or named differently, login will silently fail or redirect to the wrong page.

**Role-based redirect after login:**
```
role === "admin"  →  goes to /admin
role === "user"   →  goes to /dashboard
```

**On failure, send:**
```json
{ "message": "Invalid email or password" }
```

---

### 3.3 — Logout

| Detail | Value |
|--------|-------|
| Method | `POST` |
| URL | `/api/auth/logout` |
| Auth required | Yes — JWT in `Authorization` header |

**How the frontend sends the token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request body:** empty `{}`

**What the frontend does with the response:**  
Nothing — it clears local state and redirects to `/login` regardless of the response. Even if this endpoint fails, the user is still logged out on the frontend.

**Recommended success response:**
```json
{ "message": "Logged out successfully" }
```

---

### 3.4 — Get Profile

| Detail | Value |
|--------|-------|
| Method | `GET` |
| URL | `/api/auth/profile` |
| Auth required | Yes — JWT in `Authorization` header |

**How the frontend sends the token:**
```
Authorization: Bearer <token>
```

**Expected response:**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "role": "user"
}
```

> This endpoint is defined in `authApi.js` but not yet called in any component. It is ready for you to hook up later (e.g., to refresh user info on page load).

---

## 4. How the Frontend Stores the JWT Token

The token lives **only in React memory (RAM)** — stored in `AuthContext.jsx` using `useState`.

```
Login API response
      │
      └─ data.token ──► useState(token) inside AuthContext
                              │
                              └─ passed as  Authorization: Bearer <token>
                                 on every protected API call
```

**What this means for you:**
- You do **not** need to set any cookies from the backend for the web client to work (the frontend handles token storage itself).
- The token is lost when the user refreshes the page (this is expected for now — persistence via `localStorage` is a future improvement).
- You still need to **validate** the token on every protected route on the backend.

---

## 5. How the Frontend Reads Error Messages

Every `catch` block in the frontend reads the error like this:

```js
err.response?.data?.message
```

This means your error responses **must** follow this shape:

```json
{ "message": "Your human-readable error here" }
```

If the `message` field is missing, the frontend falls back to a generic string like `"Login failed. Please try again."` — so the user won't know what actually went wrong.

---

## 6. CORS — You Must Enable This on the Backend

The frontend runs on `http://localhost:5173` (Vite's default port).  
The backend runs on `http://localhost:5000`.

These are **different origins**, so the browser will block all requests unless the backend explicitly allows it. Add this to your Express `server.js`:

```js
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",   // the frontend's address
  credentials: true,                  // needed if you use cookies later
}));
```

Without this, **every single API call will fail** in the browser with a CORS error, even if the backend logic is correct.

---

## 7. Protected Route Logic (What the Backend Must Enforce Too)

The frontend blocks access to pages like this:

```
User visits /dashboard
      │
      └─ ProtectedRoute checks: is token in memory?
            │
            ├─ No  → redirect to /login
            └─ Yes → show the Dashboard page
```

```
User visits /admin
      │
      └─ ProtectedRoute checks: is token in memory AND role === "admin"?
            │
            ├─ No  → redirect to /dashboard
            └─ Yes → show the AdminDashboard page
```

> ⚠️ This is **client-side only**. A malicious user can bypass it. The backend **must** also verify the JWT on every protected endpoint and check the role for admin routes. The frontend check is just for UX — the real security is on your side.

---

## 8. Complete Request/Response Reference Card

| Endpoint | Method | Request Body | Required Response Fields |
|----------|--------|-------------|--------------------------|
| `/api/auth/register` | POST | `{ name, email, password }` | any `2xx` (no specific fields needed) |
| `/api/auth/login` | POST | `{ email, password }` | `{ token, user: { name, email, role } }` |
| `/api/auth/logout` | POST | `{}` + `Authorization` header | any `2xx` |
| `/api/auth/profile` | GET | none + `Authorization` header | `{ name, email, role }` |

---

## 9. Quick Integration Checklist

Before telling the frontend developer the backend is ready, verify:

- [ ] Server runs on **port 5000**
- [ ] CORS is enabled for `http://localhost:5173`
- [ ] `POST /api/auth/register` — accepts `{ name, email, password }`, returns `2xx`
- [ ] `POST /api/auth/login` — returns `{ token, user: { name, email, role } }` exactly
- [ ] `POST /api/auth/logout` — accepts `Authorization: Bearer <token>` header
- [ ] `GET /api/auth/profile` — accepts `Authorization: Bearer <token>` header
- [ ] All error responses use shape `{ "message": "..." }`
- [ ] JWT `role` field on the user is either `"user"` or `"admin"` (exact strings)
