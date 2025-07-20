const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: {
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Removed index: true
  questions: [{
    text: { type: String, required: true },
    type: { type: String, enum: ['text', 'multiple-choice', 'checkbox'], required: true },
    options: [{ type: String }],
  }],
  createdAt: { type: Date, default: Date.now },
});

// Define index on userId (not unique)
surveySchema.index({ userId: 1 }, { unique: false });

module.exports = mongoose.model('Survey', surveySchema);
