const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user.role was set by protect middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      })
    }
    next()
  }
}

module.exports = { authorizeRoles }