const Milestone = require('../models/milestoneModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all milestones for the authenticated user
// @route   GET /api/milestones
// @access  Private
const getMilestones = asyncHandler(async (req, res) => {
  const { status, priority, projectId, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;
  
  // Build query object
  const query = { userId: req.user._id };
  
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (projectId) query.projectId = projectId;
  
  // Build sort object
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  try {
    const milestones = await Milestone.find(query)
      .populate('projectId', 'title')
      .sort(sortOptions);
    
    res.json(milestones);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch milestones');
  }
});

// @desc    Create a new milestone
// @route   POST /api/milestones
// @access  Private
const createMilestone = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, projectId, notes } = req.body;
  
  // Validate required fields
  if (!title || !description || !dueDate) {
    res.status(400);
    throw new Error('Please provide title, description, and due date');
  }
  
  // Validate due date is not in the past
  const dueDateObj = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dueDateObj < today) {
    res.status(400);
    throw new Error('Due date cannot be in the past');
  }
  
  try {
    const milestone = await Milestone.create({
      title,
      description,
      dueDate: dueDateObj,
      priority: priority || 'medium',
      userId: req.user._id,
      projectId: projectId || null,
      notes: notes || ''
    });
    
    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate('projectId', 'title');
    
    res.status(201).json(populatedMilestone);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(messages.join(', '));
    }
    
    res.status(500);
    throw new Error('Failed to create milestone');
  }
});

// @desc    Update a milestone
// @route   PUT /api/milestones/:id
// @access  Private
const updateMilestone = asyncHandler(async (req, res) => {
  const { title, description, dueDate, status, priority, projectId, notes } = req.body;
  
  try {
    const milestone = await Milestone.findById(req.params.id);
    
    if (!milestone) {
      res.status(404);
      throw new Error('Milestone not found');
    }
    
    // Check if user owns this milestone
    if (milestone.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this milestone');
    }
    
    // Validate due date if provided
    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDateObj < today && status !== 'completed') {
        res.status(400);
        throw new Error('Due date cannot be in the past for non-completed milestones');
      }
      milestone.dueDate = dueDateObj;
    }
    
    // Update fields
    if (title) milestone.title = title;
    if (description) milestone.description = description;
    if (status) {
      milestone.status = status;
      // Set completedAt when marking as completed
      if (status === 'completed' && !milestone.completedAt) {
        milestone.completedAt = new Date();
      } else if (status !== 'completed') {
        milestone.completedAt = null;
      }
    }
    if (priority) milestone.priority = priority;
    if (projectId !== undefined) milestone.projectId = projectId || null;
    if (notes !== undefined) milestone.notes = notes;
    
    await milestone.save();
    
    const updatedMilestone = await Milestone.findById(milestone._id)
      .populate('projectId', 'title');
    
    res.json(updatedMilestone);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(messages.join(', '));
    }
    
    if (error.message.includes('not found') || error.message.includes('authorized')) {
      throw error; // Re-throw custom errors
    }
    
    res.status(500);
    throw new Error('Failed to update milestone');
  }
});

// @desc    Delete a milestone
// @route   DELETE /api/milestones/:id
// @access  Private
const deleteMilestone = asyncHandler(async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    
    if (!milestone) {
      res.status(404);
      throw new Error('Milestone not found');
    }
    
    // Check if user owns this milestone
    if (milestone.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this milestone');
    }
    
    await Milestone.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('authorized')) {
      throw error; // Re-throw custom errors
    }
    
    res.status(500);
    throw new Error('Failed to delete milestone');
  }
});

module.exports = {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone
};
