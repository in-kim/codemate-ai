import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
}

export class CreateReviewDto {
  @ApiProperty({
    enum: ProgrammingLanguage,
    description: '프로그래밍 언어',
    example: ProgrammingLanguage.JAVASCRIPT,
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
}
