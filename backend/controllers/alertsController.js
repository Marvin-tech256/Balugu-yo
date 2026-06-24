// backend/controllers/alertsController.js
const Notification = require('../models/Notification');
const Prediction = require('../models/Prediction');
const Planting = require('../models/Planting');

// GET ALL NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getByUserId(req.user.user_id);
    const unreadCount = await Notification.countUnread(req.user.user_id);

    res.json({
      success: true,
      unread_count: unreadCount,
      count: notifications.length,
      notifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET UNREAD ONLY
const getUnread = async (req, res) => {
  try {
    const notifications = await Notification.getUnread(req.user.user_id);
    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get unread error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// MARK ONE AS READ
const markAsRead = async (req, res) => {
  try {
    await Notification.markAsRead(req.params.id, req.user.user_id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// MARK ALL AS READ
const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.user_id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    await Notification.delete(req.params.id, req.user.user_id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CHECK AND GENERATE HARVEST ALERTS
// This runs and checks if any farmer's harvest is approaching
const checkHarvestAlerts = async (req, res) => {
  try {
    const predictions = await Prediction.getByUserId(req.user.user_id);
    const alertsCreated = [];

    for (const pred of predictions) {
      const daysLeft = pred.days_remaining;

      // Alert at 30 days
      if (daysLeft <= 30 && daysLeft > 27) {
        await Notification.create({
          user_id: req.user.user_id,
          title: 'Harvest in 30 Days',
          message: `Your ${pred.yam_variety} on ${pred.farm_name} is due for harvest around ${new Date(pred.predicted_harvest_date).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}. Start preparing your tools and storage.`,
          type: 'harvest'
        });
        alertsCreated.push('30-day alert');
      }

      // Alert at 14 days
      if (daysLeft <= 14 && daysLeft > 11) {
        await Notification.create({
          user_id: req.user.user_id,
          title: 'Harvest in 2 Weeks',
          message: `Your ${pred.yam_variety} on ${pred.farm_name} should be harvested by ${new Date(pred.predicted_harvest_date).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}. Check vine condition and prepare harvest team.`,
          type: 'harvest'
        });
        alertsCreated.push('14-day alert');
      }

      // Alert at 7 days
      if (daysLeft <= 7 && daysLeft > 4) {
        await Notification.create({
          user_id: req.user.user_id,
          title: 'Harvest This Week',
          message: `URGENT: Your ${pred.yam_variety} on ${pred.farm_name} is ready for harvest this week. Optimal harvest date: ${new Date(pred.predicted_harvest_date).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}.`,
          type: 'harvest'
        });
        alertsCreated.push('7-day alert');
      }
    }

    res.json({
      success: true,
      message: `Checked harvest alerts. ${alertsCreated.length} new alerts created.`,
      alerts_created: alertsCreated
    });

  } catch (error) {
    console.error('Check alerts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// SEND A TEST NOTIFICATION (for testing purposes)
const sendTestNotification = async (req, res) => {
  try {
    await Notification.create({
      user_id: req.user.user_id,
      title: 'Welcome to Balugu Yo',
      message: 'Your account is set up successfully. Add your first farm and planting to get a data driven advice from an extension officer.',
      type: 'system'
    });

    res.json({
      success: true,
      message: 'Test notification sent!'
    });

  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getNotifications,
  getUnread,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  checkHarvestAlerts,
  sendTestNotification
};