import mongoose from 'mongoose';

const CodeHistorySchema = new mongoose.Schema(
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
    worSpaceId: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    timestamps: false,
  },
);

export const CodeHistory = mongoose.model('CodeHistory', CodeHistorySchema);
