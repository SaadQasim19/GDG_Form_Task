const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// Debug middleware: log incoming requests
app.use(function (req, res, next) {
  console.log('Incoming request:', req.method, req.path, 'Body:', req.body)
  next()
})

app.get('/', (req, res) => {
  res.json({ message: ' Auth API is running' })
})

app.use('/api/auth', require('./routes/authRoutes'))  // /api/auth/register, login, logout, profile
app.use('/api',      require('./routes/apiRoutes'))   // /api/dashboard, /api/admin

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
})
