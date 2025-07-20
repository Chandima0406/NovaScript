const Notification = require('../models/notificationModel');
const asyncHandler = require('express-async-handler');

// Get all notifications for a user
const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, onlyUnread = false } = req.query;
  
  const query = { recipient: req.user._id };
  if (onlyUnread === 'true') {
    query.isRead = false;
  }
  
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
    
  const count = await Notification.countDocuments(query);
  
  res.json({
    notifications,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalNotifications: count,
    unreadCount: await Notification.countDocuments({ recipient: req.user._id, isRead: false })
  });
});

// Mark notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  
  // Ensure user can only modify their own notifications
  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this notification');
  }
  
  notification.isRead = true;
  await notification.save();
  
  res.json(notification);
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );
  
  res.json({ message: 'All notifications marked as read' });
});

// Delete a notification
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  
  // Ensure user can only delete their own notifications
  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this notification');
  }
  
  await notification.deleteOne();
  res.json({ message: 'Notification removed' });
});

// Create notification (admin or system use)
const createNotification = asyncHandler(async (req, res) => {
  const { recipient, title, message, relatedItem } = req.body;
  
  // Check if user has appropriate permissions (admin or researcher)
  if (req.user.role !== 'admin' && req.user.role !== 'researcher') {
    res.status(403);
    throw new Error('Not authorized to create notifications');
  }
  
  const notification = await Notification.create({
    recipient,
    type: 'survey', // Only survey type is supported
    title,
    message,
    relatedItem,
    itemModel: 'Survey',
  });
  
  res.status(201).json(notification);
});

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};
