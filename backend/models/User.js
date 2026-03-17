// backend/models/User.js
const db = require('../config/db');

const User = {

  // Create a new user
  create: async (userData) => {
    const { full_name, phone, pin_hash, role, district } = userData;
    const [result] = await db.execute(
      `INSERT INTO users (full_name, phone, pin_hash, role, district) 
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, phone, pin_hash, role, district]
    );
    return result;
  },

  // Find user by phone number
  findByPhone: async (phone) => {
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE phone = ?`,
      [phone]
    );
    return rows[0];
  },

  // Find user by ID
  findById: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT user_id, full_name, phone, role, district, created_at 
       FROM users WHERE user_id = ?`,
      [user_id]
    );
    return rows[0];
  },

  // Get all users (admin only)
  getAll: async () => {
    const [rows] = await db.execute(
      `SELECT user_id, full_name, phone, role, district, created_at 
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  }

};

module.exports = User;