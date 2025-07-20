const express = require('express');
const router = express.Router();
const { authMiddleware: protect } = require('../middlewares/authMiddleware');
const {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllProjects,
  getAllSurveys,
  broadcastNotification
} = require('../controllers/adminController');

// All admin routes are protected and only accessible by admins
// The admin authorization check is done within each controller function

// Get platform statistics
router.get('/stats', protect, getPlatformStats);

// User management
router.get('/users', protect, getAllUsers);
router.put('/users/:userId/role', protect, updateUserRole);
router.put('/users/:userId/status', protect, toggleUserStatus);

// Content management
router.get('/projects', protect, getAllProjects);
router.get('/surveys', protect, getAllSurveys);

// Notification management
router.post('/notifications/broadcast', protect, broadcastNotification);

module.exports = router;
