const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/user', authMiddleware, getUserProfile);
router.put('/user/profile', authMiddleware, updateUserProfile);

module.exports = router;
