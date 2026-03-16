// backend/routes/alerts.js
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnread,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  checkHarvestAlerts,
  sendTestNotification
} = require('../controllers/alertsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.get('/unread', protect, getUnread);
router.get('/check-harvest', protect, checkHarvestAlerts);
router.get('/test', protect, sendTestNotification);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;