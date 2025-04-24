// src/modules/execution/execution.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ExecutionService } from './execution.service';

@Controller('execute')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post()
  runCode(@Body() body: { language: string; code: string }) {
    try {
      return this.executionService.run(body.language, body.code);
    } catch (e) {
      console.error('❌ 코드 실행 중 오류 발생:', e);
      throw e;
    }
  }
}
