# 🔐 MERN Authentication System — Project Roadmap

> **Web & Mobile Auth · JWT · Role-Based Access Control · Team Project**  
> **Deadline:** 15 March 2026

---

## 👥 Team

| Role | Responsibility |
|------|---------------|
| **Backend Developer** | REST API, MongoDB, JWT, Auth & Role Middleware |
| **Frontend Developer** | UI Forms, Token Storage, Protected Routes, Dashboards |

---

## 🎯 Project Goal

Build a **reusable, production-ready JWT authentication system** for both web and mobile clients using the MERN stack. The system supports dual-delivery of tokens (HTTP-only cookies for browsers, response body for mobile), role-based access control, and a clean middleware architecture.

---

## ✅ Core Features

- [ ] User Registration API
- [ ] User Login API *(web + mobile support)*
- [ ] JWT Token Generation & Verification
- [ ] HTTP-only Cookie *(web)* / Response Body *(mobile)*
- [ ] Auth Middleware *(Authorization header + cookie)*
- [ ] Role Middleware *(admin / user)*
- [ ] Protected Routes

---

## 📅 Sprint Timeline

| Day | Date | Tasks |
|-----|------|-------|
| **Day 1** | Wed, Mar 11 | Project setup · GitHub branches · `.env` config |
| **Day 2** | Thu, Mar 12 | Backend: User model · Register API · Login API |
| **Day 3** | Fri, Mar 13 | Backend: Auth & Role Middleware · Frontend: Login/Register forms · Auth Context |
| **Day 4** | Sat, Mar 14 | Frontend: Protected routes · Dashboards · Backend ↔ Frontend integration |
| **Day 5** | Sun, Mar 15 | End-to-end testing · Bug fixes · `develop → main` final merge |

---

## 🌿 Git Branch Strategy

```
main                    →  Final submission only (protected)
develop                 →  Integration & staging branch
feature/backend-auth    →  Backend developer's working branch
feature/frontend-auth   →  Frontend developer's working branch
```

> **Workflow:** `feature/*` → PR into `develop` → reviewed → merged into `main` on Day 5.

---

## 🗂️ Project Structure

### Backend — `mern-auth-backend/`

```
mern-auth-backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   └── authController.js        # register, login, logout, profile
├── middleware/
│   ├── authMiddleware.js        # JWT verification (header + cookie)
│   └── roleMiddleware.js        # Role-based access guard
├── models/
│   └── User.js                  # Mongoose user schema
├── routes/
│   └── authRoutes.js            # Route definitions
├── utils/
│   └── generateToken.js         # JWT signing utility
└── server.js                    # Express app entry point
```

### Frontend — `mern-auth-frontend/`

```
mern-auth-frontend/
├── src/
│   ├── api/
│   │   └── authApi.js           # Axios calls to auth endpoints
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx   # Route guard component
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state (token, user, role)
│   └── pages/
│       ├── Dashboard.jsx        # User dashboard
│       └── AdminDashboard.jsx   # Admin-only dashboard
└── App.jsx                      # Route definitions & layout
```

---

## 🔑 Authentication Logic

### Token Delivery Strategy

The Login API accepts an optional `mobile` flag in the request body:

| Client | `mobile` Flag | Token Delivery |
|--------|--------------|----------------|
| Web Browser | `false` *(default)* | HTTP-only cookie (auto-managed by browser) |
| Mobile App (Flutter) | `true` | Token returned in JSON response body → stored in `AsyncStorage` |

### Auth Middleware Flow

```
Incoming Request
      │
      ├─ Check: Authorization: Bearer <token>   (header)
      │
      └─ Fallback: req.cookies.token             (cookie)
            │
            ├─ Valid → attach user to req, proceed
            └─ Invalid / Missing → 401 Unauthorized
```

### Roles

| Role | Access Level |
|------|-------------|
| `user` | Standard protected routes + User Dashboard |
| `admin` | All routes + Admin Dashboard |

---

## 🛣️ API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Create new user account |
| `POST` | `/api/auth/login` | Public | Authenticate and receive token |
| `POST` | `/api/auth/logout` | Authenticated | Clear session / cookie |
| `GET` | `/api/auth/profile` | Authenticated | Get current user profile |
| `GET` | `/api/dashboard` | Authenticated · `user` | User dashboard data |
| `GET` | `/api/admin` | Authenticated · `admin` | Admin-only data |

---

## ✔️ Submission Checklist

### Backend
- [ ] Register & Login APIs functional and tested
- [ ] `mobile` flag correctly returns token in body or sets HTTP-only cookie
- [ ] Auth middleware validates both `Authorization` header and cookie
- [ ] Role middleware returns `403 Forbidden` for unauthorized roles
- [ ] `.env` added to `.gitignore` — no secrets committed

### Frontend
- [ ] Register & Login forms functional with validation
- [ ] Token stored correctly per platform (cookie / AsyncStorage)
- [ ] `ProtectedRoute` redirects unauthenticated users to `/login`
- [ ] Role-based dashboard access enforced on the client
- [ ] Logout clears token and resets auth state

### Team
- [ ] Full end-to-end test passed (register → login → access → logout)
- [ ] `develop` → `main` pull request reviewed and merged
- [ ] `README.md` includes setup instructions and environment variables

---

## ⚙️ Environment Variables

```env
# Backend (.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```
---

*Deadline: **15 March 2026** · Built with MongoDB · Express · React · Node.js*
