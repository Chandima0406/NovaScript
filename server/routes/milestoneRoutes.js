const express = require('express');
const router = express.Router();
const {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone
} = require('../controllers/milestoneController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/milestones
// @desc    Get all milestones for the authenticated user
// @access  Private
router.get('/', getMilestones);

// @route   POST /api/milestones
// @desc    Create a new milestone
// @access  Private
router.post('/', createMilestone);

// @route   PUT /api/milestones/:id
// @desc    Update a milestone
// @access  Private
router.put('/:id', updateMilestone);

// @route   DELETE /api/milestones/:id
// @desc    Delete a milestone
// @access  Private
router.delete('/:id', deleteMilestone);

module.exports = router;