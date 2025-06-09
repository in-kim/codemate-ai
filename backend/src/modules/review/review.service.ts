import { Injectable, HttpStatus } from '@nestjs/common';
import { LoggerService } from 'src/shared/logger/logger.service';
import { AppHttpException } from 'src/shared/exceptions/http.exception';
import { ErrorCodes } from 'src/shared/exceptions/error-codes';
import { getSupportedLanguages } from 'src/shared/enums/programming-language.enum';
import { getPrompt } from './prompts';
import { VertexAiService } from '../vertex/vertex.service';
import { ICodeReview } from 'src/models/code-review.model';
import { randomUUID } from 'crypto';
import { GenerateContentCandidate } from '@google-cloud/vertexai';

interface IVertexAIFeedback {
  suggestions?: IVertexAIFeedbackSuggestion[];
  summary?: string;
}
interface IVertexAIFeedbackSuggestion {
  line: number;
  type: string;
  message: string;
}

@Injectable()
export class ReviewService {
  constructor(
    private readonly logger: LoggerService,
    private readonly vertex: VertexAiService,
  ) {}

  private transformVertexResponse(
    feedbacks: IVertexAIFeedback[],
    userId: string,
    codeId: string,
  ): ICodeReview {
    if (!feedbacks || !Array.isArray(feedbacks) || feedbacks.length === 0) {
      throw new AppHttpException(
        ErrorCodes.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      _id: randomUUID(),
      codeId,
      userId,
      summary: feedbacks[0]?.summary || '리뷰 생성 실패',
      suggestions: feedbacks[0]?.suggestions,
    };
  }

  private parseVertexResponse(
    candidates: GenerateContentCandidate[],
  ): IVertexAIFeedback[] {
    return candidates.map((candidate) => {
      try {
        const content = candidate.content?.parts?.[0]?.text;
        if (!content) {
          throw new Error('응답 형식이 올바르지 않습니다.');
        }
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const jsonString = content.match(jsonRegex)?.[1].trim() || '';
        return JSON.parse(jsonString) as IVertexAIFeedback;
      } catch (error) {
        this.logger.error('응답 파싱 오류', error.stack, 'ReviewService');
        return {
          suggestion: [],
          summary: '응답 파싱에 실패했습니다.',
        };
      }
    });
  }

  async generateReview(
    language: string,
    code: string,
    userId: string,
    codeId: string,
  ): Promise<ICodeReview> {
    this.logger.log(`리뷰 생성 요청 - 언어: ${language}`, 'ReviewService');

    // 지원 언어 확인
    if (!getSupportedLanguages().includes(language)) {
      throw new AppHttpException(
        ErrorCodes.UNSUPPORTED_LANGUAGE,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Vertex AI 프롬프트 구성
      const prompt = getPrompt(language, code);
      const response = await this.vertex.generate_from_text_input(prompt);

      if (!response || !Array.isArray(response)) {
        throw new AppHttpException(
          ErrorCodes.INTERNAL_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Vertex AI 응답을 파싱하고 ICodeReview 형식으로 변환
      const feedbacks = this.parseVertexResponse(response);
      return this.transformVertexResponse(feedbacks, userId, codeId);
    } catch (error) {
      this.logger.error('Vertex AI 호출 오류', error.stack, 'ReviewService');
      throw new AppHttpException(
        ErrorCodes.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
