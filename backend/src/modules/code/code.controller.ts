import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import { CodeService } from './code.service';
import { ICodeHistory } from 'src/models/code-history.model';

@Public()
@ApiTags('Code')
@Controller('/api/code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Get('/execute/:workSpaceId')
  @ApiOperation({ summary: '워크스페이스의 코드 조회' })
  @ApiParam({
    name: 'workSpaceId',
    type: 'string',
    description: '워크스페이스 ID',
  })
  @ApiResponse({
    description: '코드 조회 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            fileName: { type: 'string' },
            content: { type: 'string' },
            language: { type: 'string' },
            workSpaceId: { type: 'string' },
            isSaved: { type: 'boolean' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  /**
   * 워크스페이스의 코드를 조회합니다.
   * @param workSpaceId 워크스페이스 ID
   * @returns 코드 정보
   */
  async getCode(@Param('workSpaceId') workSpaceId: string) {
    return await this.codeService.getCode(workSpaceId);
  }

  @Get('/execute/:workSpaceId/with-history')
  @ApiOperation({ summary: '워크스페이스의 코드를 최신 히스토리와 함께 조회' })
  @ApiParam({
    name: 'workSpaceId',
    type: 'string',
    description: '워크스페이스 ID',
  })
  @ApiResponse({
    description: '코드 조회 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            fileName: { type: 'string' },
            content: { type: 'string' },
            language: { type: 'string' },
            workSpaceId: { type: 'string' },
            isSaved: { type: 'boolean' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
            latestHistory: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                codeId: { type: 'string' },
                userId: { type: 'string' },
                worSpaceId: { type: 'string' },
                code: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  /**
   * 워크스페이스의 코드를 최신 히스토리와 함께 조회합니다.
   * @param workSpaceId 워크스페이스 ID
   * @returns 코드 정보와 최신 히스토리
   */
  async getCodeWithHistory(@Param('workSpaceId') workSpaceId: string) {
    return await this.codeService.getCodeWithHistory(workSpaceId);
  }

  @Get('/execute/history/:codeId')
  @ApiOperation({ summary: '코드 히스토리 조회' })
  @ApiParam({ name: 'codeId', type: 'string', description: '코드 ID' })
  @ApiResponse({
    description: '코드 히스토리 조회 성공',
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
              _id: { type: 'string' },
              codeId: { type: 'string' },
              userId: { type: 'string' },
              worSpaceId: { type: 'string' },
              code: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  /**
   * 코드의 히스토리를 조회합니다.
   * @param codeId 코드 ID
   * @returns 코드 히스토리 목록
   */
  async getCodeHistory(
    @Param('codeId') codeId: string,
    @Query('limit') limit?: number,
  ): Promise<ICodeHistory[]> {
    return await this.codeService.getCodeHistory(codeId, limit);
  }

  @Get('/execute/latest-history/:codeId')
  @ApiOperation({ summary: '코드의 최신 히스토리 조회' })
  @ApiParam({ name: 'codeId', type: 'string', description: '코드 ID' })
  @ApiResponse({
    description: '코드 최신 히스토리 조회 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Request completed successfully' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            codeId: { type: 'string' },
            userId: { type: 'string' },
            worSpaceId: { type: 'string' },
            code: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  /**
   * 코드의 최신 히스토리를 조회합니다.
   * @param codeId 코드 ID
   * @returns 코드의 최신 히스토리
   */
  async getLatestCodeHistory(@Param('codeId') codeId: string) {
    return await this.codeService.getLatestCodeHistory(codeId);
  }

  @Post('/execute')
  @ApiOperation({ summary: '코드 실행' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        language: { type: 'string' },
        code: { type: 'string' },
        userId: { type: 'string', description: '사용자 ID (선택)' },
        workSpaceId: { type: 'string', description: '워크스페이스 ID (선택)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '코드 실행 결과' })
  runCode(
    @Body()
    body: {
      language: string;
      code: string;
      userId?: string;
      workSpaceId?: string;
    },
  ) {
    try {
      return this.codeService.runCode(
        body.language,
        body.code,
        body.userId,
        body.workSpaceId,
      );
    } catch (e) {
      console.error('❌ 코드 실행 중 오류 발생:', e);
      throw e;
    }
  }
}
