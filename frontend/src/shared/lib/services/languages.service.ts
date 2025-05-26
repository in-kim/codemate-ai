// shared/api/execution.ts
import { HttpResponse } from '@/shared/types/response';
import { fetcher } from '../fetcher';
import { handleApiError } from '../utils/utils';

export interface ILanguage {
  id: string;
  name: string;
  icon: string;
  extension: string;
}

/**
 * 지원하는 프로그래밍 언어 목록을 가져옵니다.
 * @returns 언어 목록
 */
export async function getLanguages(): Promise<HttpResponse<ILanguage[]>> {
  try {
    const response = await fetcher<HttpResponse<ILanguage[]>>('/api/languages');
    return response as HttpResponse<ILanguage[]>;;
  } catch (error) {
    handleApiError(error, '언어 목록 조회 실패');
  }
} 