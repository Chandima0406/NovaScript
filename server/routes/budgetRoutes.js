const express = require('express');
const router = express.Router();
const {
  getProjectBudgets,
  addBudgetEntry,
  updateBudgetEntry,
  deleteBudgetEntry,
  getBudgetSummary
} = require('../controllers/budgetController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all budget entries for a project
router.get('/project/:projectId', getProjectBudgets);

// Get budget summary for a project
router.get('/project/:projectId/summary', getBudgetSummary);

// Add a new budget entry
router.post('/project/:projectId', addBudgetEntry);

// Update a budget entry
router.put('/project/:projectId/:budgetId', updateBudgetEntry);

// Delete a budget entry
router.delete('/project/:projectId/:budgetId', deleteBudgetEntry);

module.exports = router;
