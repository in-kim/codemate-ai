import { fetcher } from '../lib/fetcher';
import { HttpResponse } from '../types/response';

export interface Language {
  id: string;
  name: string;
  icon: string;
  extension: string;
}

/**
 * 지원하는 프로그래밍 언어 목록을 가져옵니다.
 * @returns 언어 목록
 */
export async function getLanguages(): Promise<Language[]> {
  try {
    const res = await fetcher<HttpResponse<Language[]>>('/api/languages');
    return res.data;
  } catch (error) {
    console.error('언어 목록 조회 실패:', error);
    return [];
  }
} 