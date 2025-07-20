const Budget = require('../models/budgetModel');
const ResearchProject = require('../models/researchProjectModel');

// Get all budget entries for a project
const getProjectBudgets = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project exists and user has access
    const project = await ResearchProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const budgets = await Budget.find({ projectId }).sort({ date: -1 });
    
    res.status(200).json(budgets);
  } catch (error) {
    console.error('Error fetching project budgets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new budget entry
const addBudgetEntry = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { category, cost, date, description } = req.body;
    
    // Verify project exists and user has access
    const project = await ResearchProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Validate required fields
    if (!category || !cost || !date) {
      return res.status(400).json({ message: 'Category, cost, and date are required' });
    }
    
    if (cost < 0) {
      return res.status(400).json({ message: 'Cost must be a positive number' });
    }
    
    const budgetEntry = new Budget({
      projectId,
      category: category.trim(),
      cost: parseFloat(cost),
      date: new Date(date),
      description: description ? description.trim() : '',
      createdBy: req.user._id
    });
    
    await budgetEntry.save();
    
    res.status(201).json(budgetEntry);
  } catch (error) {
    console.error('Error adding budget entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a budget entry
const updateBudgetEntry = async (req, res) => {
  try {
    const { projectId, budgetId } = req.params;
    const { category, cost, date, description } = req.body;
      // Verify project exists and user has access
    const project = await ResearchProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Find and update budget entry
    const budgetEntry = await Budget.findOne({ _id: budgetId, projectId });
    if (!budgetEntry) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }
    
    if (budgetEntry.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Validate and update fields
    if (category) budgetEntry.category = category.trim();
    if (cost !== undefined) {
      if (cost < 0) {
        return res.status(400).json({ message: 'Cost must be a positive number' });
      }
      budgetEntry.cost = parseFloat(cost);
    }
    if (date) budgetEntry.date = new Date(date);
    if (description !== undefined) budgetEntry.description = description.trim();
    
    await budgetEntry.save();
    
    res.status(200).json(budgetEntry);
  } catch (error) {
    console.error('Error updating budget entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a budget entry
const deleteBudgetEntry = async (req, res) => {
  try {
    const { projectId, budgetId } = req.params;
      // Verify project exists and user has access
    const project = await ResearchProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Find and delete budget entry
    const budgetEntry = await Budget.findOne({ _id: budgetId, projectId });
    if (!budgetEntry) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }
    
    if (budgetEntry.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Budget.findByIdAndDelete(budgetId);
    
    res.status(200).json({ message: 'Budget entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get budget summary for a project
const getBudgetSummary = async (req, res) => {
  try {
    const { projectId } = req.params;
      // Verify project exists and user has access
    const project = await ResearchProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const budgets = await Budget.find({ projectId });
    
    // Calculate total spending
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.cost, 0);
    
    // Group by category
    const categoryTotals = budgets.reduce((acc, budget) => {
      acc[budget.category] = (acc[budget.category] || 0) + budget.cost;
      return acc;
    }, {});
    
    // Get project's estimated budget (if available)
    const estimatedBudget = project.estimatedBudget || 0;
    const budgetUsagePercentage = estimatedBudget > 0 ? (totalSpent / estimatedBudget) * 100 : 0;
    
    res.status(200).json({
      totalSpent,
      estimatedBudget,
      budgetUsagePercentage: Math.round(budgetUsagePercentage * 100) / 100,
      categoryTotals,
      entryCount: budgets.length
    });
  } catch (error) {
    console.error('Error getting budget summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjectBudgets,
  addBudgetEntry,
  updateBudgetEntry,
  deleteBudgetEntry,
  getBudgetSummary
};
