import React, { useState, useEffect, useCallback } from 'react';
import { 
  getProjectBudgets, 
  getBudgetSummary, 
  addBudgetEntry, 
  updateBudgetEntry, 
  deleteBudgetEntry 
} from '../api';
import '../styles/BudgetManager.css';

const BudgetManager = ({ projectId, estimatedBudget = 0, onError }) => {
  const [budgets, setBudgets] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({
    totalSpent: 0,
    estimatedBudget: 0,
    budgetUsagePercentage: 0,
    categoryTotals: {},
    entryCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const fetchBudgetData = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const [budgetsRes, summaryRes] = await Promise.all([
        getProjectBudgets(projectId),
        getBudgetSummary(projectId)
      ]);
      
      setBudgets(budgetsRes.data);
      setBudgetSummary(summaryRes.data);
    } catch (err) {
      console.error('Error fetching budget data:', err);
      const errorMessage = 'Failed to load budget data';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      category: '',
      cost: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setShowAddForm(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.cost || !formData.date) {
      setError('Category, cost, and date are required');
      return;
    }

    if (parseFloat(formData.cost) <= 0) {
      setError('Cost must be a positive number');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editingBudget) {
        await updateBudgetEntry(projectId, editingBudget._id, formData);
      } else {
        await addBudgetEntry(projectId, formData);
      }

      await fetchBudgetData();
      resetForm();
    } catch (err) {
      console.error('Error saving budget entry:', err);
      setError(err.response?.data?.message || 'Failed to save budget entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      cost: budget.cost.toString(),
      date: new Date(budget.date).toISOString().split('T')[0],
      description: budget.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget entry?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteBudgetEntry(projectId, budgetId);
      await fetchBudgetData();
    } catch (err) {
      console.error('Error deleting budget entry:', err);
      setError('Failed to delete budget entry');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressBarColor = (percentage) => {
    if (percentage <= 50) return '#10b981'; // Green
    if (percentage <= 80) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const budgetUsagePercentage = Math.min(budgetSummary.budgetUsagePercentage, 100);

  return (
    <div className="budget-manager">
      <div className="budget-header">
        <h3>Budget Tracker</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          disabled={loading}
        >
          {showAddForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Budget Summary */}
      <div className="budget-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Total Spent</h4>
            <p className="amount">{formatCurrency(budgetSummary.totalSpent)}</p>
          </div>
          <div className="summary-card">
            <h4>Estimated Budget</h4>
            <p className="amount">{formatCurrency(budgetSummary.estimatedBudget || estimatedBudget)}</p>
          </div>
          <div className="summary-card">
            <h4>Budget Usage</h4>
            <p className="percentage">{budgetUsagePercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="budget-progress">
          <div className="progress-header">
            <span>Budget Usage</span>
            <span>{budgetUsagePercentage.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${budgetUsagePercentage}%`,
                backgroundColor: getProgressBarColor(budgetUsagePercentage)
              }}
            ></div>
          </div>
          <div className="progress-labels">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(budgetSummary.estimatedBudget || estimatedBudget)}</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="budget-form">
          <h4>{editingBudget ? 'Edit Expense' : 'Add New Expense'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Software">Software</option>
                  <option value="Travel">Travel</option>
                  <option value="Materials">Materials</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Personnel">Personnel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cost">Cost ($)</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the expense"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editingBudget ? 'Update' : 'Add')} Expense
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses Table */}
      <div className="expenses-table">
        <h4>Expense History ({budgetSummary.entryCount} entries)</h4>
        {loading && <div className="loading">Loading...</div>}
        {budgets.length === 0 && !loading ? (
          <div className="no-data">No expenses recorded yet</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget._id}>
                    <td>{formatDate(budget.date)}</td>
                    <td>
                      <span className={`category-tag category-${budget.category.toLowerCase()}`}>
                        {budget.category}
                      </span>
                    </td>
                    <td>{budget.description || '-'}</td>
                    <td className="cost-cell">{formatCurrency(budget.cost)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(budget)}
                          className="btn btn-sm btn-secondary"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(budget._id)}
                          className="btn btn-sm btn-danger"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {Object.keys(budgetSummary.categoryTotals).length > 0 && (
        <div className="category-breakdown">
          <h4>Spending by Category</h4>
          <div className="category-list">
            {Object.entries(budgetSummary.categoryTotals).map(([category, total]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-amount">{formatCurrency(total)}</span>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ 
                      width: `${(total / budgetSummary.totalSpent) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;
