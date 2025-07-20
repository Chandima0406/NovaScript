const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a milestone title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a milestone description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchProject',
    required: false // Optional, can be associated with a project or standalone
  },
  completedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Index for faster queries
milestoneSchema.index({ userId: 1, dueDate: 1 });
milestoneSchema.index({ projectId: 1 });

// Middleware to automatically set status to overdue
milestoneSchema.pre('find', function() {
  this.where({ 
    dueDate: { $lt: new Date() }, 
    status: { $nin: ['completed', 'overdue'] } 
  }).updateMany({ status: 'overdue' });
});

milestoneSchema.pre('findOne', function() {
  this.where({ 
    dueDate: { $lt: new Date() }, 
    status: { $nin: ['completed', 'overdue'] } 
  }).updateMany({ status: 'overdue' });
});

// Virtual for time remaining
milestoneSchema.virtual('timeRemaining').get(function() {
  if (this.status === 'completed') return 'Completed';
  
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  
  if (diffTime < 0) return 'Overdue';
  
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return '1 day remaining';
  if (diffDays < 7) return `${diffDays} days remaining`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} remaining`;
  }
  
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? 's' : ''} remaining`;
});

// Ensure virtual fields are serialized
milestoneSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
