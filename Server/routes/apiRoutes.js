const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')

// ─────────────────────────────────────────────────────────────
// GET /api/dashboard
// Who can access: any logged-in user (role = "user" OR "admin")
// ─────────────────────────────────────────────────────────────
router.get('/dashboard', protect, authorizeRoles('user', 'admin'), (req, res) => {
  res.json({ message: 'Welcome to your dashboard!', user: req.user })
})

// ─────────────────────────────────────────────────────────────
// GET /api/admin
// Who can access: admin only
// ─────────────────────────────────────────────────────────────
router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user })
})

module.exports = router
