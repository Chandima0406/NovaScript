const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllAsRead, 
  deleteNotification, 
  createNotification 
} = require('../controllers/notificationController');
const { authMiddleware: protect } = require('../middlewares/authMiddleware');

// Get all notifications for the authenticated user
router.get('/', protect, getUserNotifications);

// Mark notification as read
router.patch('/:id/read', protect, markNotificationAsRead);

// Mark all notifications as read
router.patch('/read-all', protect, markAllAsRead);

// Delete a notification
router.delete('/:id', protect, deleteNotification);

// Create a notification (admin/researcher only)
router.post('/', protect, createNotification);

module.exports = router;
