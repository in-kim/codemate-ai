import { HttpResponse } from "@/shared/types/response";

/**
 * 여러 className 문자열을 조건부로 합쳐주는 유틸리티
 * ex) cn('base', isActive && 'active', isError && 'error')
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * HttpResponse가 성공 응답인지 확인하는 유틸리티
 */
export function isHttpResponseSuccess<T>(res: unknown): res is HttpResponse<T> {
  return typeof res === 'object' && res !== null && 'status' in res && res.status === 'success';
}