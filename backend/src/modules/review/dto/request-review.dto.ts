import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
}

export class RequestReviewDto {
  @ApiProperty({
    enum: ProgrammingLanguage,
    description: '프로그래밍 언어',
    example: ProgrammingLanguage.JAVASCRIPT,
    enumName: 'ProgrammingLanguage',
  })
  @IsEnum(ProgrammingLanguage)
  @IsNotEmpty()
  language: ProgrammingLanguage;

  @ApiProperty({
    description: '리뷰할 코드',
    example: 'const hello = "world";',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: '사용자 ID',
    example: '60d21b4667d0d8992e610c86',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '코드 ID',
    example: '60d21b4667d0d8992e610c87',
  })
  @IsMongoId()
  @IsNotEmpty()
  codeId: string;
}
