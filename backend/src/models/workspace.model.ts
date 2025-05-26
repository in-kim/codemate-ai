// src/models/room.model.ts
import { Schema, Types, model } from 'mongoose';
import { UserDocument } from './user.model';

export type WorkspaceDocument = Workspace & Document;
export interface Workspace {
  workSpaceId: string;
  workSpaceName?: string;
  owner: Types.ObjectId;
  participants: Participants[];
  deletedAt?: Date;
  createdAt: Date;
}

export interface Participants
  extends Pick<UserDocument, 'username' | 'avatarUrl'> {
  userId: Types.ObjectId;
}

export const WorkSpaceSchema = new Schema<Workspace>(
  {
    workSpaceId: { type: String, required: true, unique: true }, // 소켓 방 ID 또는 초대 링크용
    workSpaceName: { type: String, required: false }, // 방 이름
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
        avatarUrl: { type: String },
      },
    ],
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }, // createdAt, updatedAt 자동 생성
);

export const WorkspaceModel = model('workspace', WorkSpaceSchema);
