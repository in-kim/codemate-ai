import mongoose from 'mongoose';

export const CodeReviewHistorySchema = new mongoose.Schema({
  codeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Code',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  review: {
    type: {
      line: { type: Number, required: true },
      language: { type: String, required: true },
      code: { type: String, required: true },
      summary: { type: String, required: true },
      suggestions: { type: Array, required: true },
    },
    ref: 'CodeReview',
    required: true,
  },
  createdAt: {
    type: Date,
    ref: 'CodeReview',
    required: true,
  },
});

export const CodeReviewHistory = mongoose.model(
  'CodeReviewHistory',
  CodeReviewHistorySchema,
);
