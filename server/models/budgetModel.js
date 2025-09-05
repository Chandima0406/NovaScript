const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchProject',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
budgetSchema.index({ projectId: 1, date: -1 });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
