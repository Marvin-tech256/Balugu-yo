// backend/models/Notification.js
const db = require('../config/db');

const Notification = {

  // Create notification
  create: async (data) => {
    const { user_id, title, message, type } = data;
    const [result] = await db.execute(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [user_id, title, message, type || 'system']
    );
    return result;
  },

  // Get all notifications for a user
  getByUserId: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY sent_at DESC`,
      [user_id]
    );
    return rows;
  },

  // Get unread notifications
  getUnread: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM notifications 
       WHERE user_id = ? AND is_read = FALSE
       ORDER BY sent_at DESC`,
      [user_id]
    );
    return rows;
  },

  // Mark single notification as read
  markAsRead: async (notif_id, user_id) => {
    const [result] = await db.execute(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE notif_id = ? AND user_id = ?`,
      [notif_id, user_id]
    );
    return result;
  },

  // Mark all notifications as read
  markAllAsRead: async (user_id) => {
    const [result] = await db.execute(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE user_id = ?`,
      [user_id]
    );
    return result;
  },

  // Count unread
  countUnread: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT COUNT(*) as count 
       FROM notifications 
       WHERE user_id = ? AND is_read = FALSE`,
      [user_id]
    );
    return rows[0].count;
  },

  // Delete a notification
  delete: async (notif_id, user_id) => {
    const [result] = await db.execute(
      `DELETE FROM notifications 
       WHERE notif_id = ? AND user_id = ?`,
      [notif_id, user_id]
    );
    return result;
  }

};

module.exports = Notification;