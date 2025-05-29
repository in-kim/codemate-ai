import mongoose from 'mongoose';
import { CodeHistory } from './code-history.model';

/**
 * room, code, user 컬렉션으로 나눈다.
 * room정보
 * github login 유저 정보 저장
 * room 정보를 저장
 * room 정보를 가져온다.
 
 * 
 */

export interface ICode {
  _id: string;
  userId: string;
  fileName: string;
  content: string;
  language: string;
  workSpaceId: string;
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const CodeSchema = new mongoose.Schema(
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
    workSpaceId: {
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// 가장 최근 코드 히스토리를 가져오는 가상 필드 추가
CodeSchema.virtual('latestHistory', {
  ref: 'CodeHistory',
  localField: '_id',
  foreignField: 'codeId',
  justOne: true,
  options: { sort: { createdAt: -1 } }, // 가장 최근 히스토리
});

// 가장 최근 코드 히스토리의 코드 내용을 가져오는 정적 메서드
CodeSchema.statics.findWithLatestHistory = async function (id) {
  const code = await this.findById(id);
  if (!code) return null;

  const latestHistory = await CodeHistory.findOne({ codeId: code._id })
    .sort({ createdAt: -1 })
    .exec();

  if (latestHistory) {
    code.content = latestHistory.code;
  }

  return code;
};

export const Code = mongoose.model('Code', CodeSchema);
