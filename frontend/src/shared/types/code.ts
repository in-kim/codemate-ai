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


export type TCodeResponse = HttpResponse<IGetCodeData>
export type TExecuteHistoryResponse = HttpResponse<IGetExecuteHistoryData[]>