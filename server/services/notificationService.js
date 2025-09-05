const Notification = require('../models/notificationModel');

/**
 * Create a notification when someone responds to a survey
 * @param {string} surveyId - The survey ID that was responded to
 * @param {Object} survey - The survey object containing creator information
 * @param {string} responderName - Name of the person who responded
 */
const createSurveyResponseNotification = async (surveyId, survey, responderName) => {
  try {
    const notification = new Notification({
      recipient: survey.userId, // Survey creator's user ID
      type: 'survey',
      title: 'New Survey Response',
      message: `${responderName} has answered your survey "${survey.title}"`,
      relatedItem: surveyId,
      itemModel: 'Survey',
      isRead: false    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating survey response notification:', error);
    throw error;
  }
};

/**
 * Create a system notification
 * @param {string} recipientId - User ID of the recipient
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (only 'survey' is supported)
 */
const createSystemNotification = async (recipientId, title, message, type = 'survey') => {
  try {
    // Only allow survey type notifications
    if (type !== 'survey') {
      console.warn(`Attempted to create notification of unsupported type: ${type}. Converting to survey type.`);
      type = 'survey';
    }

    const notification = new Notification({
      recipient: recipientId,
      type: type,
      title: title,
      message: message,
      isRead: false
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating system notification:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 * @param {string} userId - User ID to get notifications for
 * @param {boolean} unreadOnly - Whether to get only unread notifications
 */
const getUserNotifications = async (userId, unreadOnly = false) => {
  try {
    const query = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .populate('relatedItem', 'title name')
      .limit(50); // Limit to last 50 notifications    return notifications;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID to mark as read
 * @param {string} userId - User ID (for security check)
 */
const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }    return notification;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID to mark all notifications as read
 */
const markAllNotificationsAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID to get unread count for
 */
const getUnreadNotificationCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });    return count;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete old notifications (older than 30 days)
 * This can be used as a cleanup function
 */
const cleanupOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true
    });    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSurveyResponseNotification,
  createSystemNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  cleanupOldNotifications
};