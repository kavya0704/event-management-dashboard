const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// In-memory notifications (for demo purposes)
let notifications = [];

// GET /api/notifications — Get notifications for current user
router.get('/', auth, async (req, res) => {
  const userNotifications = notifications
    .filter(n => n.userId === req.user._id.toString() || n.global)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);

  res.json(userNotifications);
});

// POST /api/notifications/mark-read — Mark all as read
router.post('/mark-read', auth, async (req, res) => {
  notifications = notifications.map(n => {
    if (n.userId === req.user._id.toString()) {
      return { ...n, read: true };
    }
    return n;
  });

  res.json({ message: 'Notifications marked as read' });
});

// Utility: add a notification (used by other modules)
const addNotification = (userId, message, type = 'info') => {
  notifications.push({
    id: Date.now().toString(),
    userId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  });

  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications = notifications.slice(-100);
  }
};

module.exports = router;
module.exports.addNotification = addNotification;
