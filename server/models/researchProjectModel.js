const mongoose = require('mongoose');

const researchProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  researchField: { type: String, required: true },  methodology: { type: String },
  expectedDuration: { type: String },
  objectives: [{ type: String }],
  keywords: [{ type: String }],
  collaborators: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },  status: { 
    type: String, 
    enum: ['planning', 'active', 'on-hold', 'completed'], 
    default: 'planning' 
  },
  estimatedBudget: { 
    type: Number, 
    min: 0,
    default: 0 
  },
  timeline: {
    phases: {
      projectPlanning: {
        title: { type: String, default: 'Project Planning' },
        duration: { type: Number, default: 14 },
        saved: { type: Boolean, default: false }
      },
      researchPhase: {
        title: { type: String, default: 'Research Phase' },
        duration: { type: Number, default: 30 },
        saved: { type: Boolean, default: false }
      },
      dataCollection: {
        title: { type: String, default: 'Data Collection' },
        duration: { type: Number, default: 45 },
        saved: { type: Boolean, default: false }
      },
      analysisPhase: {
        title: { type: String, default: 'Analysis Phase' },
        duration: { type: Number, default: 30 },
        saved: { type: Boolean, default: false }
      },
      finalReport: {
        title: { type: String, default: 'Final Report' },
        duration: { type: Number, default: 21 },
        saved: { type: Boolean, default: false }
      }
    },
    totalDuration: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
researchProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ResearchProject', researchProjectSchema);
