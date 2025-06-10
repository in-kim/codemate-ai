import mongoose from 'mongoose';

export interface ICodeReview {
  _id: string;
  codeId: string;
  userId: string;
  summary: string;
  suggestions?: { line: number; type: string; message: string }[];
}

export const CodeReviewSchema = new mongoose.Schema(
  {
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
    summary: {
      type: String,
      default: '',
    },
    suggestions: [
      {
        line: { type: Number, required: true },
        type: {
          type: String,
          default: 'style',
        },
        message: { type: String, required: true },
      },
    ],
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const CodeReview = mongoose.model('CodeReview', CodeReviewSchema);
