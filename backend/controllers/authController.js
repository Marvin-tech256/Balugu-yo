// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Validation helpers
const VALID_ROLES = ['farmer', 'extension_officer', 'admin']
const VALID_DISTRICTS = ['Buikwe', 'Bukunja', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka', 'Mbarara', 'Other']

function validatePhone(phone) {
  return /^\+256\d{9}$/.test(phone)
}
function validatePin(pin) {
  return /^\d{4}$/.test(pin)
}
function validateName(name) {
  return /^[a-zA-Z]+([\s'\-][a-zA-Z]+)*$/.test(name.trim())
}

// REGISTER
const register = async (req, res) => {
  try {
    const { full_name, phone, pin, role, district } = req.body;

    if (!full_name || !phone || !pin || !district)
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' })

    if (!validateName(full_name))
      return res.status(400).json({ success: false, message: 'Name must contain letters only (2-100 characters)' })

    if (!validatePhone(phone))
      return res.status(400).json({ success: false, message: 'Phone must be in format +256XXXXXXXXX' })

    if (!validatePin(pin))
      return res.status(400).json({ success: false, message: 'PIN must be exactly 4 digits' })

    if (role && !VALID_ROLES.includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' })

    if (!VALID_DISTRICTS.includes(district))
      return res.status(400).json({ success: false, message: 'Invalid district selected' })

    const existingUser = await User.findByPhone(phone);
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Phone number already registered' })

    const pin_hash = await bcrypt.hash(pin, 10);
    const result = await User.create({
      full_name: full_name.trim(),
      phone,
      pin_hash,
      role: role || 'farmer',
      district
    });

    res.status(201).json({ success: true, message: 'Account created successfully!', user_id: result.insertId });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin)
      return res.status(400).json({ success: false, message: 'Phone and PIN are required' })

    if (!validatePhone(phone))
      return res.status(400).json({ success: false, message: 'Invalid phone number format' })

    if (!validatePin(pin))
      return res.status(400).json({ success: false, message: 'PIN must be exactly 4 digits' })

    const user = await User.findByPhone(phone);
    if (!user)
      return res.status(401).json({ success: false, message: 'Phone number not registered' })

    const pinMatch = await bcrypt.compare(pin, user.pin_hash);
    if (!pinMatch)
      return res.status(401).json({ success: false, message: 'Incorrect PIN' })

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        district: user.district
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// LOGOUT
const logout = (_req, res) => {
  res.json({ success: true, message: 'You have been logged out successfully' });
};

// CHANGE PIN
const changePin = async (req, res) => {
  try {
    const { old_pin, new_pin } = req.body;
    if (!old_pin || !new_pin) return res.status(400).json({ success: false, message: 'Both PINs required' });
    const user = await User.findById(req.user.user_id);
    const fullUser = await User.findByPhone(user.phone);
    const match = await bcrypt.compare(old_pin, fullUser.pin_hash);
    if (!match) return res.status(401).json({ success: false, message: 'Current PIN is incorrect' });
    const pin_hash = await bcrypt.hash(new_pin, 10);
    await User.updatePin(req.user.user_id, pin_hash);
    res.json({ success: true, message: 'PIN updated successfully' });
  } catch (err) {
    console.error('Change PIN error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN STATS
const adminStats = async (req, res) => {
  try {
    const db = require('../config/db');
    const [[{ users }]] = await db.execute('SELECT COUNT(*) as users FROM users');
    const [[{ farms }]] = await db.execute('SELECT COUNT(*) as farms FROM farms');
    const [[{ predictions }]] = await db.execute('SELECT COUNT(*) as predictions FROM predictions');
    const [[{ alerts }]] = await db.execute('SELECT COUNT(*) as alerts FROM notifications');
    res.json({ success: true, stats: { users, farms, predictions, alerts } });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET ALL USERS (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// GET CURRENT USER (protected route)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { register, login, getMe, logout, changePin, adminStats, getAllUsers };