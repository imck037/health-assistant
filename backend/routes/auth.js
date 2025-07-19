// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      message: 'Registration successful! Please login.',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login user with email
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Send OTP for mobile verification
router.post('/send-otp', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // In a real application, you would:
    // 1. Store the OTP in the database with an expiration time
    // 2. Send the OTP via SMS using a service like Twilio
    // For now, we'll just return the OTP in the response
    console.log(`OTP for ${mobileNumber}: ${otp}`);

    // Store OTP in user document or temporary storage
    // This is a simplified version - in production, use Redis or similar
    await User.findOneAndUpdate(
      { mobileNumber },
      { 
        $set: { 
          otp,
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
        }
      },
      { upsert: true }
    );

    res.json({ 
      message: 'OTP sent successfully',
      // In production, don't send the OTP in response
      otp // Remove this in production
    });
  } catch (error) {
    console.error('OTP sending error:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Find user with the mobile number and valid OTP
    const user = await User.findOne({
      mobileNumber,
      otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear the OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, mobileNumber: user.mobileNumber },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

module.exports = router;
