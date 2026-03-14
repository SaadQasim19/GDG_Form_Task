const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// ─────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' })
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    // 3. Admins must be set manually in DB or via a separate admin-only route
    const user = await User.create({ name, email, password, role: 'user' })

    // 4. Send back success
    res.status(200).json({
    message: 'Logged in successfully',
    token,
      user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ─────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password, mobile } = req.body

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // 2. Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 3. Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 4. Generate JWT token
    const token = generateToken(user._id, user.role)

    // 5. Mobile vs Web — different token delivery
    if (mobile) {
      // Mobile: return token in response body
      // Flutter will store it in AsyncStorage
      return res.status(200).json({
        message: 'Logged in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    }

    // Web: set HTTP-only cookie — JS cannot access this (XSS safe)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
    })

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ─────────────────────────────────────
// @route   POST /api/auth/logout
// @access  Private
// ─────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logged out successfully' })
}

// ─────────────────────────────────────
// @route   GET /api/auth/profile
// @access  Private
// ─────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware after token verification
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { register, login, logout, getProfile }