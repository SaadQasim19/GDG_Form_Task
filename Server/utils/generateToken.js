const jwt = require('jsonwebtoken')

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },   // payload — what's stored inside the token
    process.env.JWT_SECRET,        // secret key — only your server knows this
    { expiresIn: process.env.JWT_EXPIRES_IN }  // token expires in 7d
  )
}

module.exports = generateToken