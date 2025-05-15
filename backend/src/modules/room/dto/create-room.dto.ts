// src/modules/room/dto/create-room.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @ApiProperty({
    example: '개발팀 코드리뷰',
    description: '방 이름',
    required: true,
  })
  roomName: string;

  @ApiProperty({
    example: 'sdfljk124',
    description: '유저 고유 ID',
    required: true,
  })
  @IsString()
  userId: string;
}
