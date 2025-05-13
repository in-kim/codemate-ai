// src/models/room.model.ts
import { Schema, Types, model } from 'mongoose';

export type RoomDocument = Room & Document;
export interface Room {
  roomId: string;
  name?: string;
  owner: Types.ObjectId;
  participants: Types.ObjectId[];
  deletedAt?: Date;
  createdAt: Date;
}

export const RoomSchema = new Schema<Room>(
  {
    roomId: { type: String, required: true, unique: true }, // 소켓 방 ID 또는 초대 링크용
    name: { type: String, required: false }, // 방 이름
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: Types.ObjectId, ref: 'User' }],
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }, // createdAt, updatedAt 자동 생성
);

export const RoomModel = model('Room', RoomSchema);
