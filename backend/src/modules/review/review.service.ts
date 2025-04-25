import { Injectable, HttpStatus } from '@nestjs/common';
import { LoggerService } from 'src/shared/logger/logger.service';
import { AppHttpException } from 'src/shared/exceptions/http.exception';
import { ErrorCodes } from 'src/shared/exceptions/error-codes';
import { getPrompt } from './prompts';
import { VertexAiService } from '../vertex/vertex.service';
import { ResponseHelper } from 'src/shared/utils/response.helper';
import { GenerateContentCandidate } from '@google-cloud/vertexai';

@Injectable()
export class ReviewService {
  constructor(
    private readonly logger: LoggerService,
    private readonly vertex: VertexAiService,
  ) {}

  async generateReview(
    language: string,
    code: string,
  ): Promise<
    | ReturnType<typeof ResponseHelper.success>
    | ReturnType<typeof ResponseHelper.fail>
  > {
    this.logger.log(`리뷰 생성 요청 - 언어: ${language}`, 'ReviewService');

    // 지원 언어 확인
    if (!['javascript', 'python'].includes(language)) {
      throw new AppHttpException(
        ErrorCodes.UNSUPPORTED_LANGUAGE,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Vertex AI 프롬프트 구성
    const prompt = getPrompt(language, code);
    const feedbacks = await this.vertex.generate_from_text_input(prompt); // Vertex 호출

    try {
      const isGeneratedSuccess = feedbacks && feedbacks.length > 0;

      if (isGeneratedSuccess) {
        return ResponseHelper.success<GenerateContentCandidate[]>(feedbacks);
      } else {
        return ResponseHelper.fail('Failed to generate review');
      }
    } catch (err) {
      this.logger.error('Vertex AI 호출 오류', err.stack, 'ReviewService');

      throw new AppHttpException(
        ErrorCodes.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
