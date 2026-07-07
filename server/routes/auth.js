const express = require('express');
const router = express.Router();

// Mock authentication routes for demonstration purposes
// In a real app, you would use a database and proper JWT/session management

router.post('/login', (req, res) => {
  const { email, password, otp } = req.body;
  
  // Basic validation mock
  if (email && (password || otp)) {
    res.json({
      success: true,
      token: 'mock-jwt-token-12345',
      user: {
        id: 1,
        email,
        name: email.split('@')[0],
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  const { email, password, phone } = req.body;
  
  if (email && password && phone) {
    res.json({
      success: true,
      message: 'Registration successful. Please login.',
    });
  } else {
    res.status(400).json({ success: false, message: 'Missing required fields' });
  }
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  
  if (email) {
    res.json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } else {
    res.status(400).json({ success: false, message: 'Email is required' });
  }
});

module.exports = router;
