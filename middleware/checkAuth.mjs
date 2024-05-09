import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.mjs'

const checkAuth = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decode = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decode.userId).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const checkAdmin = (req, res, next) => {
  // Verify if the user is an admin
  console.log(req.user)
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permission denied' })
  }

  next()
}

export { checkAuth, checkAdmin }
