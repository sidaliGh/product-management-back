import User from '../models/user.mjs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import HttpError from '../assets/http-error.mjs'

dotenv.config()
// Create a transporter for sending emails.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})
// User registration.
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Hash the user's password with a salt factor of 12.
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
      // Handle any errors that occur during hashing
      const error = new HttpError('Please try to register later', 500)
      return next(error)
    }

    // Create a new user with the hashed password.
    const user = new User({ name, email, password: hashedPassword })

    // Save the user to the database.
    await user.save()

    // Generate token for email verification.
    const activationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // Token expires in 1 hour.
      }
    )

    // Compose the activation email.
    const activationLink = `${process.env.APP_BASE_URL}/activate/${activationToken}`
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Activate Your Account',
      text: `Click the following link to activate your account: ${activationLink}`,
    }

    // Send the activation email.
    await transporter.sendMail(mailOptions)

    res
      .status(201)
      .json({
        message:
          'User registered successfully. Check your email for activation instructions.',
      })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Activate user account.
const activateUser = async (req, res) => {
  try {
    const { token } = req.params
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId

    // Find and update the user's account status.
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    user.isActivated = true
    await user.save()

    res.status(200).json({ message: 'Account activated successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

//login user
const loginUser = async (req, res) => {
  try {
    const { email } = req.body

    // Trim and store the received password.
    const receivedPassword = req.body.password.trim()

    // Check if the user exists.
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Authentication failed - user not found' })
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(receivedPassword, user.password)

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Authentication failed - incorrect password' })
    }

    // Check if the user is activated.
    if (!user.isActivated) {
      return res
        .status(401)
        .json({ message: 'Authentication failed - account not activated' })
    }

    // Generate a JWT token with user information.
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Include the user's role in the token.
      },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    )

    // Return the token and a success message.
    res.status(200).json({
      message: 'Authentication successful',
      user: token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Authentication failed' })
  }
}

// Generate a unique token for password reset.
const generatePasswordResetToken = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Create a reset password token with a 1-hour expiration.
    const resetPasswordToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordTokenExpiry = Date.now() + 3600000 //expired after 1 hour

    await user.save()

    // Compose the password reset email
    const resetPasswordLink = `${process.env.APP_BASE_URL}/reset-password/${resetPasswordToken}`
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      text: `Click the following link to reset your password: ${resetPasswordLink}`,
    }

    // Send the password reset email
    await transporter.sendMail(mailOptions)

    res
      .status(200)
      .json({
        message:
          'Password reset email sent. Check your inbox for instructions.',
      })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Reset user's password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() }, // Check if token is not expired
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    // Update user's password and clear reset token fields
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpiry = undefined
    await user.save()

    res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export {
  registerUser,
  activateUser,
  loginUser,
  resetPassword,
  generatePasswordResetToken,
}
