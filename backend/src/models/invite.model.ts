import mongoose from 'mongoose';

export const InviteSchema = new mongoose.Schema(
  {
    codeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Code',
      required: true,
    },
    inviterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    githubUsername: {
      type: String,
      required: true,
    },
    githubEmail: {
      type: String,
      required: true,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

export const Invite = mongoose.model('Invite', InviteSchema);
