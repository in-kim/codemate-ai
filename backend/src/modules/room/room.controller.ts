import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';

@Public()
@ApiTags('Workspace')
@Controller('/api/workspace')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: '페어 코딩 방 만들기' })
  @ApiBody({
    type: CreateRoomDto,
    description: '방 생성 정보',
  })
  /**
   * 새로운 방을 생성합니다.
   * @param body.userId 방의 소유자 ID
   * @param dto 방 생성 정보
   * @returns 방 ID, 이름, 생성일
   */
  async createRoom(
    @Body() body: CreateRoomDto,
  ): Promise<{ roomId: string; roomName: string | undefined; createAt: Date }> {
    return await this.roomService.createRoom({
      userId: body.userId,
      roomName: body.roomName,
    });
  }
  @Post('/:roomId/join')
  @ApiOperation({ summary: '페어 코딩 방 참여' })
  @ApiParam({ name: 'roomId', type: 'string', description: '방 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
    },
  })
  @ApiResponse({
    description: '방 참여 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            roomId: { type: 'string' },
            participants: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  })
  /**
   * 방에 참가합니다.
   * @param roomId 방 ID
   * @param body.userId 참가할 사용자 ID
   * @returns 방 ID, 방에 참가한 모든 사용자 목록
   */
  async joinRoom(
    @Param('roomId') roomId: string,
    @Body() body: { userId: string },
  ) {
    return await this.roomService.joinRoom(roomId, body.userId);
  }

  @Delete('/:roomId/leave')
  @ApiParam({ name: 'roomId', type: 'string', description: '방 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
    },
  })
  @ApiOperation({ summary: '페어 코딩 방 퇴장' })
  @ApiResponse({
    description: '방 퇴장 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            roomId: { type: 'string' },
            participants: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  })
  /**
   * 방에서 퇴장합니다.
   * @param req Request
   * @param roomId 방 ID
   * @returns 방 ID, 방에 남은 사용자 목록
   */
  async leaveRoom(@Body() body, @Param('roomId') roomId: string) {
    const userId: string = body.userId;
    return await this.roomService.leaveRoom(roomId, userId);
  }

  @Get('/my/:userId')
  @ApiOperation({ summary: '내가 속한 방 목록 가져오기' })
  @ApiParam({ name: 'userId', type: 'string', description: '사용자 ID' })
  @ApiResponse({
    description: '방 목록 가져오기 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              roomId: { type: 'string' },
              roomName: { type: 'string' },
              createAt: { type: 'string' },
              participants: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  })
  /**
   * 내가 속한 방 목록을 가져옵니다.
   * @param userId 사용자 ID
   * @returns 방 목록 (방 ID, 방 이름, 생성일, 참가자 목록)
   */
  async getMyRooms(@Param('userId') userId: string) {
    console.log('userId: ', userId);
    // 내가 속한 방 목록을 가져옴
    return await this.roomService.getMyRooms(userId);
  }

  @Delete('/:roomId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
    },
  })
  @ApiOperation({ summary: '방 삭제' })
  @ApiResponse({
    description: '방 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            roomId: { type: 'string' },
          },
        },
      },
    },
  })
  /**
   * 방을 삭제합니다.
   * @param roomId 방 ID
   * @param body.userId 방의 소유자 ID
   * @returns 방 ID
   */
  async deleteRoom(@Param('roomId') roomId: string, @Body() body) {
    const userId: string = body.userId;
    return await this.roomService.deleteRoom(roomId, userId);
  }

  @Post('/:roomId/create-invite-link')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
    },
  })
  @ApiOperation({ summary: '방 초대 링크생성' })
  @ApiResponse({
    description: '방 초대 링크 생성 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string' },
          },
        },
      },
    },
  })
  /**
   * 방 초대 링크 생성
   * @param roomId 방 ID
   * @param body.userId 참가할 사용자 ID
   * @returns 방 초대 링크
   */
  generateInviteLink(@Param('roomId') roomId: string, @Body() body) {
    return this.roomService.makeInviteLink(roomId, body.userId as string);
  }

  @Get('/:roomId/invite-token')
  @ApiOperation({ summary: '방 초대 링크 검증' })
  @ApiResponse({
    description: '방 초대 링크 검증 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            roomId: { type: 'string' },
            invitedBy: { type: 'string' },
          },
        },
      },
    },
  })
  /**
   * 방 초대 링크 검증
   * @param roomId 방 ID
   * @param token 초대 링크 토큰
   * @returns 초대 링크 토큰이 포함하는 정보 (방 ID, 초대한 사람의 ID)
   */
  verifyInviteToken(
    @Param('roomId') roomId: string,
    @Query('token') token: string,
  ) {
    return this.roomService.verifyInvieToken(token);
  }
}
