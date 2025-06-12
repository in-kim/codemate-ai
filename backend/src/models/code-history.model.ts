import mongoose from 'mongoose';

export const CodeHistorySchema = new mongoose.Schema(
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
    workSpaceId: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  },
);

// 특정 코드 ID에 대한 최신 히스토리를 가져오는 정적 메서드
CodeHistorySchema.statics.getLatestByCodeId = function (codeId) {
  return this.findOne({ codeId }).sort({ createdAt: -1 }).exec();
};

export interface ICodeHistory {
  _id: string;
  codeId: string;
  userId: string;
  workSpaceId: string;
  language: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CodeHistory = mongoose.model('CodeHistory', CodeHistorySchema);
