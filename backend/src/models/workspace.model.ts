// src/models/room.model.ts
import { Schema, Types, model } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;
export interface Workspace {
  workSpaceId: string;
  workSpaceName?: string;
  owner: Types.ObjectId;
  participants: Types.ObjectId[];
  deletedAt?: Date;
  createdAt: Date;
}

export const WorkSpaceSchema = new Schema<Workspace>(
  {
    workSpaceId: { type: String, required: true, unique: true }, // 소켓 방 ID 또는 초대 링크용
    workSpaceName: { type: String, required: false }, // 방 이름
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: Types.ObjectId, ref: 'User' }],
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }, // createdAt, updatedAt 자동 생성
);

export const WorkspaceModel = model('workspace', WorkSpaceSchema);
