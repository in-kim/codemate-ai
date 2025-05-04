import mongoose from 'mongoose';

/**
 * room, code, user 컬렉션으로 나눈다.
 * room정보
 * github login 유저 정보 저장
 * room 정보를 저장
 * room 정보를 가져온다.
 
 * 
 */

const CodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      default: '',
    },
    language: {
      type: String,
      default: 'typescript',
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  },
);

export const Code = mongoose.model('Code', CodeSchema);
