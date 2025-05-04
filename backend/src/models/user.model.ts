import mongoose from 'mongoose';

export interface UserDocument extends Document {
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
}

const UserSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatarUrl: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', UserSchema);
