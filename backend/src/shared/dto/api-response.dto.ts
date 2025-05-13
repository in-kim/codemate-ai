import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';

export class APIResponse<T> {
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  message?: string;

  @ValidateNested()
  @Type(() => Object) // 동적 타입 직렬화를 위해 Type 사용
  @IsOptional()
  data?: T;

  constructor(response?: { status: string; message?: string; data?: T }) {
    if (response) {
      this.status = response.status;
      this.message = response.message;
      this.data = response.data;
    }
  }
}
