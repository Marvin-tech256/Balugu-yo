// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
const register = async (req, res) => {
  try {
    const { full_name, phone, pin, role, district } = req.body;

    // Check all fields are provided
    if (!full_name || !phone || !pin || !district) {
      return res.status(400).json({ 
        success: false,
        message: 'Please fill in all required fields' 
      });
    }

    // Check if phone already exists
    const existingUser = await User.findByPhone(phone);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number already registered' 
      });
    }

    // Hash the PIN
    const pin_hash = await bcrypt.hash(pin, 10);

    // Create the user
    const result = await User.create({
      full_name,
      phone,
      pin_hash,
      role: role || 'farmer',
      district
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user_id: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again.' 
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    // Check fields
    if (!phone || !pin) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone and PIN are required' 
      });
    }

    // Find user
    const user = await User.findByPhone(phone);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Phone number not registered' 
      });
    }

    // Check PIN
    const pinMatch = await bcrypt.compare(pin, user.pin_hash);
    if (!pinMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Incorrect PIN' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
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
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again.' 
    });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.json({ success: true, message: 'You have been logged out successfully' });
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

module.exports = { register, login, getMe };