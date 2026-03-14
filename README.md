# 🔐 GDG Form Task — Authentication System

A full-stack authentication system built with the MERN stack. Supports both **web** (React) and **mobile** (Flutter) clients with JWT authentication, bcrypt password hashing, and role-based access control.

---

## 👥 Team

| Role | GitHub |
|---|---|
| Frontend | [@SaadQasim19](https://github.com/SaadQasim19) |
| Backend | [@emannoor-cs](https://github.com/emannoor-cs)  |


---

## 📁 Project Structure

```
GDG_Form_Task/
├── Client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
└── Server/                   # Node.js backend
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── controllers/
    │   └── authController.js # Business logic
    ├── middleware/
    │   ├── authMiddleware.js  # JWT verification
    │   └── roleMiddleware.js  # Role-based access
    ├── models/
    │   └── User.js           # User schema
    ├── routes/
    │   └── authRoutes.js     # Route definitions
    ├── utils/
    │   └── generateToken.js  # JWT creation
    ├── .env.example          # Environment variable template
    └── server.js             # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Git

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/SaadQasim19/GDG_Form_Task.git
cd GDG_Form_Task/Server

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env (see Environment Variables section)

# 4. Start the server
npm run dev
```

Backend runs on `http://localhost:5000`

---

### Frontend Setup

```bash
# From the root folder
cd Client

# Install dependencies
npm install

# Start the app
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## ⚙️ Environment Variables

Create a `.env` file inside the `Server/` folder. Use `.env.example` as a template:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
ADMIN_SECRET=your_admin_secret_key_here
```

> ⚠️ Never commit your real `.env` file. It is gitignored for security.

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api/auth`

| Method | Endpoint    | Access     | Description             |
|--------|-------------|------------|-------------------------|
| POST   | `/register` | Public     | Register a new user     |
| POST   | `/login`    | Public     | Login and receive token |
| GET    | `/profile`  | Protected  | Get logged-in user info |
| GET    | `/admin`    | Admin only | Admin dashboard access  |

---

### POST `/register`

**Request:**
```json
{
  "name": "Eman",
  "email": "eman@example.com",
  "password": "pass1234"
}
```

**Response `201`:**
```json
{
  "message": "Account created",
  "user": {
    "id": "64abc...",
    "name": "Eman",
    "email": "eman@example.com",
    "role": "user"
  }
}
```

---

### POST `/login`

**Request:**
```json
{
  "email": "eman@example.com",
  "password": "pass1234",
  "mobile": false
}
```

> Set `"mobile": true` for Flutter/mobile clients — token is returned in response body instead of a cookie.

**Response `200`:**
```json
{
  "message": "Logged in",
  "token": "eyJhbGci...",
  "user": {
    "id": "64abc...",
    "name": "Eman",
    "email": "eman@example.com",
    "role": "user"
  }
}
```

---

## 🔧 Frontend Integration

### React (Web)

```js
// Login
const res = await axios.post('http://localhost:5000/api/auth/login',
  { email, password, mobile: false },
  { withCredentials: true }
)

// Protected request
const profile = await axios.get('http://localhost:5000/api/auth/profile',
  { withCredentials: true }
)
```

### Flutter (Mobile)

```dart
// Login
final res = await http.post(
  Uri.parse('$baseUrl/api/auth/login'),
  body: jsonEncode({ 'email': email, 'password': password, 'mobile': true })
);
final token = jsonDecode(res.body)['token'];

// Protected request
final profile = await http.get(
  Uri.parse('$baseUrl/api/auth/profile'),
  headers: { 'Authorization': 'Bearer $token' }
);
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt with 10 salt rounds |
| Token storage (web) | HTTP-only cookie |
| Token storage (mobile) | Response body → AsyncStorage |
| Secrets management | dotenv + `.gitignore` |
| CORS | Restricted to frontend origin |
| Role validation | Server-side middleware |
| Password field | Excluded from all responses |

---

## 👥 Roles

| Role | Access |
|---|---|
| `user` | Public + protected routes |
| `admin` | All routes including `/admin` |

---

## 🧩 Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Node.js + Express | Backend server |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM / schema validation |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| CORS | Cross-origin requests |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "add your feature"`
4. Push to your branch — `git push origin feature/your-feature`
5. Open a Pull Request targeting `main`

---

Deadline: 15 March 2026 · Built with MongoDB · Express · React · Node.js
