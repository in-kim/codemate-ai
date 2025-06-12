import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from 'src/shared/logger/logger.service';
import { EventService } from 'src/shared/events/event.service';
import { CodeExecutedEvent } from 'src/shared/events/code-executed.event';
import { LanguageExtensions } from 'src/shared/enums/language.enum';

@Injectable()
export class CodeHistoryService implements OnModuleInit {
  constructor(
    @InjectModel('CodeHistory') private codeHistoryModel: Model<any>,
    @InjectModel('Code') private codeModel: Model<any>,
    private readonly eventService: EventService,
    private readonly logger: LoggerService,
  ) {}

  onModuleInit() {
    // 이벤트 리스너 등록
    this.eventService.on('code.executed', this.handleCodeExecuted.bind(this));
    this.logger.log('코드 실행 이벤트 리스너 등록 완료', 'CodeHistoryService');
  }

  private async handleCodeExecuted(event: CodeExecutedEvent) {
    try {
      this.logger.log(
        `코드 실행 이벤트 수신 - 워크스페이스: ${event.workSpaceId}`,
        'CodeHistoryService',
      );

      // userId와 workSpaceId 검증
      if (!event.userId || !event.workSpaceId) {
        this.logger.error(
          `코드 히스토리 저장 실패: 필수 정보 누락 (userId: ${event.userId}, workSpaceId: ${event.workSpaceId})`,
          '',
          'CodeHistoryService',
        );
        throw new Error('필수 정보 누락');
      }

      // 코드 ID 조회
      let code = await this.codeModel
        .findOne({ workSpaceId: event.workSpaceId })
        .exec();

      // 코드가 없는 경우 자동으로 생성
      if (!code) {
        this.logger.log(
          `워크스페이스 ID ${event.workSpaceId}에 해당하는 코드가 없습니다. 새로 생성합니다.`,
          'CodeHistoryService',
        );

        // 새 코드 생성
        code = await this.codeModel.create({
          userId: event.userId,
          workSpaceId: event.workSpaceId,
          fileName: `${event._id}.${LanguageExtensions[event.language]}`,
          content: event.code,
          language: event.language,
          isSaved: false,
        });

        this.logger.log(`새 코드 생성 완료: ${code._id}`, 'CodeHistoryService');
      }

      // 코드 히스토리 저장
      const codeHistory = await this.codeHistoryModel.create({
        codeId: code._id,
        userId: event.userId,
        workSpaceId: event.workSpaceId,
        code: event.result.stdout,
        language: event.language,
      });

      this.logger.log(
        `코드 히스토리 저장 완료: ${codeHistory._id}`,
        'CodeHistoryService',
      );
    } catch (error) {
      this.logger.error(
        `코드 히스토리 저장 실패: ${error.message}`,
        error.stack,
        'CodeHistoryService',
      );
    }
  }
}
