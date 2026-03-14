const express = require('express')
const router = express.Router()
const { register, login, logout, getProfile } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')

// Public routes — no token needed
router.post('/register', register)
router.post('/login', login)

// Protected routes — must be logged in
router.post('/logout', protect, logout)
router.get('/profile', protect, getProfile)

// Role protected — only admin
router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: ' Welcome Admin!', user: req.user })
})

// Role protected — any logged in user
router.get('/dashboard', protect, authorizeRoles('user', 'admin'), (req, res) => {
  res.json({ message: ' Welcome to your dashboard!', user: req.user })
})

module.exports = router