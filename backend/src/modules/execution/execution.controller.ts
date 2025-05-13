// src/modules/execution/execution.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Execute')
@Controller('/api/execute')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post()
  @ApiOperation({ summary: '코드 실행' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { language: { type: 'string' }, code: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: '코드 실행 결과' })
  runCode(@Body() body: { language: string; code: string }) {
    try {
      return this.executionService.run(body.language, body.code);
    } catch (e) {
      console.error('❌ 코드 실행 중 오류 발생:', e);
      throw e;
    }
  }
}
