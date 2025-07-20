const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: { type: Map, of: mongoose.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Ensure each user can only respond once to a survey
surveyResponseSchema.index({ surveyId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
