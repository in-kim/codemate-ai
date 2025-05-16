import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { Model, Types } from 'mongoose';
import { RoomDocument } from 'src/models/room.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 새로운 방을 생성합니다.
   * @param userId 방의 소유자 ID
   * @param roomName 방 이름
   * @returns 방 ID, 이름, 생성일
   */
  async createRoom({ userId, roomName }: CreateRoomDto): Promise<{
    roomId: string;
    roomName: string | undefined;
    createAt: Date;
  }> {
    try {
      const room = await this.roomModel.create({
        roomId: nanoid(10), // 방 ID
        owner: new Types.ObjectId(userId), // 방 소유자
        roomName: roomName, // 방 이름
        participants: [new Types.ObjectId(userId)], // 방 참여자 (처음에는 소유자만)
      });

      return {
        roomId: room.roomId,
        roomName: room.roomName,
        createAt: room.createdAt,
      };
    } catch (err) {
      console.error(err);
      throw new Error('방 생성에 실패했습니다.');
    }
  }

  /**
   * 특정 방에 참가합니다.
   * @param roomId 방 ID
   * @param userId 참가할 사용자 ID
   * @returns 방 ID, 참가자 목록
   */
  async joinRoom(
    roomId: string,
    userId: string,
  ): Promise<{ roomId: string; participants: Types.ObjectId[] }> {
    try {
      const room = await this.roomModel.findOne({ roomId });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      const alreadyJoined = room.participants.some(
        (participant) => participant.toString() === userId,
      );

      if (!alreadyJoined) {
        // 방에 참가자가 추가된다.
        room.participants.push(new Types.ObjectId(userId));
        await room.save();
      }

      return {
        roomId: room.roomId,
        // 방에 참가한 모든 사용자 목록
        participants: room.participants,
      };
    } catch (err) {
      console.error(err);
      throw new Error('방 참가에 실패했습니다.');
    }
  }

  /*************  ✨ Windsurf Command 🌟  *************/
  /**
   * 방에서 사용자를 퇴장합니다.
   * @param roomId 방 ID
   * @param userId 퇴장할 사용자 ID
   * @returns 방 ID, 방에 남은 사용자 목록
   */
  async leaveRoom(roomId: string, userId: string) {
    try {
      const room = await this.roomModel.findOne({ roomId });

      if (!room) {
        throw new NotFoundException('해당 방이 존재하지 않습니다.');
      }

      // 방에 참가한 사용자인지 확인
      const isParticipant = room.participants.some(
        (participant) => participant.toString() === userId,
      );

      if (!isParticipant) {
        throw new ForbiddenException('방에 참가하지 않은 사용자입니다.');
      }

      // 방에서 퇴장
      room.participants = room.participants.filter(
        (participant) => participant.toString() !== userId,
      );

      // 방에 사용자가 남아 있지 않으면 삭제
      if (room.participants.length === 0) {
        room.deletedAt = new Date();
      }

      await room.save();

      return {
        roomId: room.roomId,
        participants: room.participants,
      };
    } catch (err) {
      console.error(err);
      throw new Error('방 퇴장에 실패했습니다.');
    }
  }

  /**
   * 내가 속한 방 목록을 가져옵니다.
   * @param userId 사용자 ID
   * @returns 방 목록 (방 ID, 이름, 생성일, 참가자 목록)
   */
  async getMyRooms(userId: string): Promise<
    {
      roomId: string;
      roomName: string | undefined;
      createAt: Date;
      participants: Types.ObjectId[];
    }[]
  > {
    try {
      const rooms = await this.roomModel
        .find({
          participants: userId,
          deleteAt: null,
        })
        .sort({ updatedAt: -1 });

      // 방 정보를 반환
      return rooms.map((room) => ({
        roomId: room.roomId,
        roomName: room.roomName,
        createAt: room.createdAt,
        participants: room.participants,
      }));
    } catch (err) {
      console.error(err);
      throw new Error('방 목록 가져오기 실패');
    }
  }

  /**
   * 방을 삭제합니다.
   * @param roomId 방 ID
   * @param userId 방의 소유자 ID
   * @returns 방 ID
   */
  async deleteRoom(
    roomId: string,
    userId: string,
  ): Promise<{ roomId: string }> {
    const room = await this.roomModel.findOne({ roomId });

    if (!room) {
      throw new NotFoundException('해당 방이 존재하지 않습니다.');
    }

    if (room.owner.toString() !== userId) {
      throw new ForbiddenException('방의 소유자가 아닙니다.');
    }

    try {
      // 방을 삭제
      await this.roomModel.deleteOne({ roomId });
      return {
        roomId: room.roomId,
      };
    } catch (err) {
      console.error(err);
      throw new Error('방 삭제에 실패했습니다.');
    }
  }
  /**
   * 초대 링크를 생성합니다.
   * @param roomId 방 ID
   * @param invitedBy 초대한 사람의 ID
   * @returns 초대 링크 URL
   */
  makeInviteLink(roomId: string, invitedBy: string): { url: string } {
    const payload = {
      roomId,
      invitedBy,
    };

    const token = this.jwtService.sign(payload);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const inviteLink = `${frontendUrl}/room/${roomId}?token=${token}`;

    return { url: inviteLink };
  }
  /**
   * 초대 링크 토큰을 검증합니다.
   * @param token 초대 링크 토큰
   * @returns 초대 링크 토큰이 포함하는 정보 (방 ID, 초대한 사람의 ID)
   */
  verifyInvieToken(token: string): boolean {
    try {
      // 초대 링크 토큰을 검증
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_INVITE_SECRET'),
      });

      console.log('payload', payload);
      return !!payload;
    } catch (err) {
      console.error(err);
      throw new Error('초대 링크 검증에 실패했습니다.');
    }
  }
}
