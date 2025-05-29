import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class GetCodeDto {
  @ApiProperty({
    description: '워크스페이스 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  workSpaceId: string;

  @ApiProperty({
    description: '사용자 ID',
    example: '60d21b4667d0d8992e610c86',
  })
  @IsMongoId()
  @IsOptional()
  userId?: string;
}
