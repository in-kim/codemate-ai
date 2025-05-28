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

export type TCodeResponse = HttpResponse<IGetCodeData>