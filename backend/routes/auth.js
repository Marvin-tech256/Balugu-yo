// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, changePin, adminStats, getAllUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/check-phone', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.json({ exists: false });
  const user = await require('../models/User').findByPhone(phone).catch(() => null);
  res.json({ exists: !!user });
});

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/change-pin', protect, changePin);

// Admin routes
router.get('/admin/stats', protect, adminOnly, adminStats);
router.get('/admin/users', protect, adminOnly, getAllUsers);

module.exports = router;