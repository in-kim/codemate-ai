import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { Model, Types } from 'mongoose';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Participants, WorkspaceDocument } from 'src/models/workspace.model';
import { UserDocument } from 'src/models/user.model';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel('workspace')
    private readonly workspaceModel: Model<WorkspaceDocument>,
    @InjectModel('user')
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 새로운 방을 생성합니다.
   * @param userId 방의 소유자 ID
   * @param workspaceName 방 이름
   * @returns 방 ID, 이름, 생성일
   */
  async createWorkspace({
    userId,
    workSpaceName,
  }: CreateWorkspaceDto): Promise<{
    workSpaceId: string;
    workSpaceName: string | undefined;
    createAt: Date;
  }> {
    try {
      const user = await this.userModel.findById(userId);
      const workspace = await this.workspaceModel.create({
        workSpaceId: nanoid(10), // 방 ID
        owner: new Types.ObjectId(userId), // 방 소유자
        workSpaceName: workSpaceName, // 방 이름
        participants: [
          {
            userId: new Types.ObjectId(userId),
            username: user?.username as string,
            avatarUrl: user?.avatarUrl,
          },
        ], // 방 참여자 (처음에는 소유자만)
      });

      return {
        workSpaceId: workspace.workSpaceId,
        workSpaceName: workspace.workSpaceName,
        createAt: workspace.createdAt,
      };
    } catch (err) {
      console.error(err);
      throw new Error('방 생성에 실패했습니다.');
    }
  }

  /**
   * 특정 방에 참가합니다.
   * @param workSpaceId 방 ID
   * @param userId 참가할 사용자 ID
   * @returns 방 ID, 참가자 목록
   */
  async joinWorkspace(
    workSpaceId: string,
    userId: Types.ObjectId,
  ): Promise<{ workSpaceId: string; participants: Participants[] }> {
    try {
      const workspace = await this.workspaceModel.findOne({ workSpaceId });
      const user = await this.userModel.findById(userId);

      if (!workspace) {
        throw new NotFoundException('방이 존재하지 않습니다.');
      }

      const alreadyJoined = workspace.participants.some(
        (participant) => participant.userId === userId,
      );

      if (!alreadyJoined) {
        // 방에 참가자가 추가된다.
        workspace.participants.push({
          userId: userId,
          username: user?.username as string,
          avatarUrl: user?.avatarUrl,
        });
        await workspace.save();
      }

      return {
        workSpaceId: workspace.workSpaceId,
        // 방에 참가한 모든 사용자 목록
        participants: workspace.participants,
      };
    } catch (err) {
      console.error(err);
      throw new Error('방 참가에 실패했습니다.');
    }
  }

  /**
   * 방에서 사용자를 퇴장합니다.
   * @param workSpaceId 방 ID
   * @param userId 퇴장할 사용자 ID
   * @returns 방 ID, 방에 남은 사용자 목록
   */
  async leaveWorkspace(workSpaceId: string, userId: string) {
    try {
      const workspace = await this.workspaceModel.findOne({ workSpaceId });

      if (!workspace) {
        throw new NotFoundException('해당 방이 존재하지 않습니다.');
      }

      // 방에 참가한 사용자인지 확인
      const isParticipant = workspace.participants.some(
        (participant) => participant.userId.toString() === userId,
      );

      if (!isParticipant) {
        throw new ForbiddenException('방에 참가하지 않은 사용자입니다.');
      }

      // 방에서 퇴장
      workspace.participants = workspace.participants.filter(
        (participant) => participant.userId.toString() !== userId,
      );

      // 방에 사용자가 남아 있지 않으면 삭제
      if (workspace.participants.length === 0) {
        workspace.deletedAt = new Date();
      }

      await workspace.save();

      return {
        workSpaceId: workspace.workSpaceId,
        participants: workspace.participants,
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
  async getMyWorkspaces(userId: string): Promise<
    {
      workSpaceId: string;
      workSpaceName: string | undefined;
      createAt: Date;
      participants: Participants[];
      owner: Types.ObjectId;
    }[]
  > {
    try {
      const workspaces = await this.workspaceModel
        .find({
          'participants.userId': userId,
          deleteAt: null,
        })
        .sort({ updatedAt: -1 });

      // 방 정보를 반환
      return workspaces.map((workspace) => ({
        workSpaceId: workspace.workSpaceId,
        workSpaceName: workspace.workSpaceName,
        createAt: workspace.createdAt,
        participants: workspace.participants,
        owner: workspace.owner,
      }));
    } catch (err) {
      console.error(err);
      throw new Error('방 목록 가져오기 실패');
    }
  }

  /**
   * 방을 삭제합니다.
   * @param workSpaceId 방 ID
   * @param userId 방의 소유자 ID
   * @returns 방 ID
   */
  async deleteWorkspace(
    workSpaceId: string,
    userId: string,
  ): Promise<{ workSpaceId: string }> {
    const workspace = await this.workspaceModel.findOne({ workSpaceId });

    if (!workspace) {
      throw new NotFoundException('해당 방이 존재하지 않습니다.');
    }

    if (workspace.owner.toString() !== userId) {
      throw new ForbiddenException('방의 소유자가 아닙니다.');
    }

    try {
      // 방을 삭제
      await this.workspaceModel.deleteOne({ workSpaceId });
      return {
        workSpaceId: workspace.workSpaceId,
      };
    } catch (err) {
      console.error(err);
      throw new Error('방 삭제에 실패했습니다.');
    }
  }
  /**
   * 초대 링크를 생성합니다.
   * @param workSpaceId 방 ID
   * @param invitedBy 초대한 사람의 ID
   * @returns 초대 링크 URL
   */
  makeInviteLink(workSpaceId: string, invitedBy: string): { url: string } {
    const payload = {
      workSpaceId,
      invitedBy,
    };

    const token = this.jwtService.sign(payload);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const inviteLink = `${frontendUrl}/workspace/${workSpaceId}?token=${token}`;

    return { url: inviteLink };
  }
  /**
   * 초대 링크 토큰을 검증합니다.
   * @param token 초대 링크 토큰
   * @returns 초대 링크 토큰이 포함하는 정보 (방 ID, 초대한 사람의 ID)
   */
  verifyInvieToken(token: string): JwtService {
    try {
      // 초대 링크 토큰을 검증
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_INVITE_SECRET'),
      });

      return payload as JwtService;
    } catch (err) {
      console.error(err);
      throw new Error('초대 링크 검증에 실패했습니다.');
    }
  }
}
