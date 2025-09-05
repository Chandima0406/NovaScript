// Admin Controller for NovaScript
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const Survey = require('../models/surveyModel');
const SurveyResponse = require('../models/surveyResponseModel');
const Notification = require('../models/notificationModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// Get platform statistics
const getPlatformStats = asyncHandler(async (req, res) => {
  // Ensure user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access admin controls');
  }

  const stats = {
    users: {
      total: await User.countDocuments(),
      researchers: await User.countDocuments({ role: 'researcher' }),
      participants: await User.countDocuments({ role: 'user' }),
      admins: await User.countDocuments({ role: 'admin' }),
      newLastWeek: await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    },
    projects: {
      total: await Project.countDocuments(),
      newLastWeek: await Project.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    },
    surveys: {
      total: await Survey.countDocuments(),
      active: await Survey.countDocuments({ status: 'active' }),
      completed: await Survey.countDocuments({ status: 'completed' }),
      totalResponses: await SurveyResponse.countDocuments(),
      newLastWeek: await Survey.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    }
  };

  res.json(stats);
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  // Ensure user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access admin controls');
  }

  const { 
    page = 1, 
    limit = 10, 
    role,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};
  
  if (role && role !== 'all') {
    query.role = role;
  }
  
  if (search) {
    query.$or = [
      { full_name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const users = await User.find(query)
    .select('-password') // Exclude password
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalUsers = await User.countDocuments(query);

  res.json({
    users,
    pagination: {
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(totalUsers / parseInt(limit))
    }
  });
});

// Update user role
const updateUserRole = asyncHandler(async (req, res) => {
  // Ensure user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access admin controls');
  }

  const { userId } = req.params;
  const { role } = req.body;

  if (!['researcher', 'user', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role specified');
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  // Create notification for user
  const notification = {
    recipient: user._id,
    type: 'system',
    title: 'Role Updated',
    message: `Your account has been updated to ${role} role by the administrator.`,
  };

  try {
    await Notification.create(notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }

  res.json({
    message: 'User role updated successfully',
    user: {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }
  });
});

// Disable/Enable user account
const toggleUserStatus = asyncHandler(async (req, res) => {
  // Ensure user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access admin controls');
  }

  const { userId } = req.params;
  const { status } = req.body;

  if (typeof status !== 'boolean') {
    res.status(400);
    throw new Error('Status must be a boolean');
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent disabling your own admin account
  if (user._id.equals(req.user._id) && !status) {
    res.status(400);
    throw new Error('Cannot disable your own admin account');
  }

  user.active = status;
  await user.save();

  // Create notification for user
  const notification = {
    recipient: user._id,
    type: 'system',
    title: status ? 'Account Enabled' : 'Account Disabled',
    message: status 
      ? 'Your account has been enabled by the administrator.' 
      : 'Your account has been disabled by the administrator. Please contact support for assistance.',
  };

  try {
    await Notification.create(notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }

  res.json({
    message: `User account ${status ? 'enabled' : 'disabled'} successfully`,
    user: {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      active: user.active
    }
  });
});

// Get all research papers with admin access
const getAllProjects = asyncHandler(async (req, res) => {
  // Ensure user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access admin controls');
  }

  const { 
    page = 1, 
    limit = 10, 
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'author.name': { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const projects = await Project.find(query)
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalProjects = await Project.countDocuments(query);

  res.json({
    projects,
    pagination: {
      total: totalProjects,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(totalProjects / parseInt(limit))
    }
  });
});

// Get all surveys with admin access
const getAllSurveys = asyncHandler(async (req, res) => {
  // Ensure user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access admin controls');
  }

  const { 
    page = 1, 
    limit = 10, 
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const surveys = await Survey.find(query)
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalSurveys = await Survey.countDocuments(query);

  res.json({
    surveys,
    pagination: {
      total: totalSurveys,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(totalSurveys / parseInt(limit))
    }
  });
});

// Broadcast notification to all users or specific role
const broadcastNotification = asyncHandler(async (req, res) => {
  // Ensure user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access admin controls');
  }

  const { title, message, targetRole } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error('Title and message are required');
  }

  const query = {};
  if (targetRole && targetRole !== 'all') {
    query.role = targetRole;
  }

  // Get all target users
  const users = await User.find(query).select('_id');

  // Create notifications for all users
  const notifications = users.map(user => ({
    recipient: user._id,
    type: 'system',
    title,
    message
  }));

  try {
    await Notification.insertMany(notifications);
    res.json({
      message: `Notification sent to ${users.length} users`,
      recipients: users.length
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to send notifications');
  }
});

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllProjects,
  getAllSurveys,
  broadcastNotification
};
