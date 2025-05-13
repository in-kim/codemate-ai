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
    roomId: { type: String, required: true }, // room.roomId
  },
  {
    timestamps: false,
  },
);

export const CodeHistory = mongoose.model('CodeHistory', CodeHistorySchema);
