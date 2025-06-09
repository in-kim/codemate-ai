import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICodeHistory } from 'src/models/code-history.model';
import { ICode } from 'src/models/code.model';

@Injectable()
export class CodeService {
  constructor(
    @InjectModel('Code') private codeModel: Model<any>,
    @InjectModel('CodeHistory') private codeHistoryModel: Model<any>,
  ) {}

  /**
   * 워크스페이스 ID로 코드를 조회합니다.
   * @param workSpaceId 워크스페이스 ID
   * @returns 코드 정보
   */
  async getCode(workSpaceId: string): Promise<ICode> {
    const code = await this.codeModel.findOne({ workSpaceId }).exec();

    if (!code) {
      throw new NotFoundException(
        `워크스페이스 ID ${workSpaceId}에 해당하는 코드를 찾을 수 없습니다.`,
      );
    }

    return code as ICode;
  }

  /**
   * 워크스페이스 ID로 코드를 조회하고 최신 히스토리를 함께 반환합니다.
   * @param workSpaceId 워크스페이스 ID
   * @returns 코드 정보와 최신 히스토리
   */
  async getCodeWithHistory(workSpaceId: string) {
    const code = await this.codeModel.findOne({ workSpaceId }).exec();

    if (!code) {
      throw new NotFoundException(
        `워크스페이스 ID ${workSpaceId}에 해당하는 코드를 찾을 수 없습니다.`,
      );
    }

    // 가상 필드를 사용하여 최신 히스토리 가져오기
    const codeWithHistory = await this.codeModel
      .findOne({ workSpaceId })
      .populate('latestHistory')
      .exec();

    return {
      status: 'success',
      message: 'Request completed successfully',
      data: codeWithHistory,
    };
  }

  /**
   * 코드 ID로 코드 히스토리를 조회합니다.
   * @param codeId 코드 ID
   * @param limit 가져올 히스토리 개수 (기본값: 10)
   * @returns 코드 히스토리 목록
   */
  async getCodeHistory(codeId: string, limit = 10): Promise<ICodeHistory[]> {
    const codeHistories = await this.codeHistoryModel
      .find({ codeId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return codeHistories as ICodeHistory[];
  }

  /**
   * 코드 ID로 최신 코드 히스토리를 조회합니다.
   * @param codeId 코드 ID
   * @returns 최신 코드 히스토리
   */
  async getLatestCodeHistory(codeId: string): Promise<ICodeHistory> {
    // 정적 메서드 대신 직접 쿼리 사용
    const latestHistory = await this.codeHistoryModel
      .findOne({ codeId })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestHistory) {
      throw new NotFoundException(
        `코드 ID ${codeId}에 해당하는 히스토리를 찾을 수 없습니다.`,
      );
    }

    return latestHistory as ICodeHistory;
  }

  /**
   * 코드 ID로 코드를 조회하고 최신 히스토리의 코드 내용을 포함하여 반환합니다.
   * @param codeId 코드 ID
   * @returns 최신 히스토리의 코드 내용이 포함된 코드 정보
   */
  async getCodeWithLatestHistory(codeId: string) {
    // 정적 메서드 대신 직접 구현
    const code = await this.codeModel.findById(codeId).exec();

    if (!code) {
      throw new NotFoundException(
        `코드 ID ${codeId}에 해당하는 코드를 찾을 수 없습니다.`,
      );
    }

    const latestHistory = await this.codeHistoryModel
      .findOne({ codeId })
      .sort({ createdAt: -1 })
      .exec();

    if (latestHistory) {
      code.content = latestHistory.code;
    }

    return {
      status: 'success',
      message: 'Request completed successfully',
      data: code,
    };
  }
}
