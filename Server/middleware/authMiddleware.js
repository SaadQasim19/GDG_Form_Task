const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    let token

    // Check 1: Authorization header (mobile clients send it here)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }
    // Check 2: HTTP-only cookie (web clients)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    // No token found anywhere
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    // Verify the token — throws error if expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to request so next handlers can use it
    req.user = { id: decoded.id, role: decoded.role }

    next() // move to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

module.exports = { protect }