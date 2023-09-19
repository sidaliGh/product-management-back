// userRoutes.mjs

import express from 'express'
import {
  registerUser,
  activateUser,
  generatePasswordResetToken,
  resetPassword,
  loginUser,
} from '../controllers/userController.mjs'
import { check, validationResult } from 'express-validator'

const router = express.Router()

// User registration and activation
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 5 }),
  ],
  registerUser
)

router.get('/activate/:token', activateUser)

// User login
router.post('/login', loginUser)

// Password reset
router.post('/generate-password-reset-token', generatePasswordResetToken)
router.post('/reset-password/:token', resetPassword)

export default router
