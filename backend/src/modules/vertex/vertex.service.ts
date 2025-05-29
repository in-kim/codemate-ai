import { HttpStatus, Injectable } from '@nestjs/common';
import { GenerateContentCandidate, VertexAI } from '@google-cloud/vertexai';
import { vertexConfig } from 'src/shared/config/vertex.config';
import { AppHttpException } from 'src/shared/exceptions/http.exception';
import { ErrorCodes } from 'src/shared/exceptions/error-codes';
import { LoggerService } from 'src/shared/logger/logger.service';
const { project, location } = vertexConfig;

@Injectable()
export class VertexAiService {
  constructor(private readonly logger: LoggerService) {}

  async generate_from_text_input(
    prompt: string,
  ): Promise<GenerateContentCandidate[] | undefined> {
    const vertexAI = new VertexAI({
      project: project,
      location: location,
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
    });

    try {
      const resp = await generativeModel.generateContent(prompt);
      const contentResponse = resp.response;
      this.logger.log(
        `Vertex AI 실행 결과: ${JSON.stringify(contentResponse)}`,
        'VertexAiService',
      );
      return contentResponse.candidates;
    } catch (err) {
      this.logger.error('Vertex AI 실행 오류', err.stack, 'VertexAiService');
      throw new AppHttpException(
        ErrorCodes.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
