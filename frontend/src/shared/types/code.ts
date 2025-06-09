import { HttpResponse } from "./response"

export interface IGetCodeData {
  _id: string,
  userId: string,
  fileName: string,
  content: string,
  language: string,
  workSpaceId: string,
  isSaved: boolean,
  createdAt: string,
  updatedAt: string
}

export interface IGetExecuteHistoryData extends Pick<IGetCodeData, '_id' | 'userId' | 'createdAt' | 'language'> {
  codeId: string;
  workSpaceId: string;
  code: string;
}

export interface IReviewResponse {
  codeId: string;
  suggestions: IReviewResponseItem[];
  summary: string;
  userId: string;
  _id: string;
}

export interface IReviewResponseItem {
  line: number;
  type: string;
  message: string;
}

export interface IExecutionResponseItem {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export type TCodeResponse = HttpResponse<IGetCodeData>
export type TExecuteHistoryResponse = HttpResponse<IGetExecuteHistoryData[]>
export type TReviewResponse = HttpResponse<IReviewResponse>
export type TExecutionResponse = HttpResponse<IExecutionResponseItem>