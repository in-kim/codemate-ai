import Cookies from 'js-cookie';
import { HttpResponse } from "@/shared/types/response";
import { CookiesOptions } from 'next-auth';
import { logError } from './errorLogger';

/**
 * 여러 className 문자열을 조건부로 합쳐주는 유틸리티
 * ex) cn('base', isActive && 'active', isError && 'error')
 * @param classes className 문자열 배열
 * @returns 합쳐진 className 문자열
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * HttpResponse가 성공 응답인지 확인하는 유틸리티
 * @param res HttpResponse 객체
 * @returns HttpResponse가 성공 응답인지 여부
 */
export function isHttpResponseSuccess<T>(res: unknown): res is HttpResponse<T> {
  return typeof res === 'object' && res !== null && 'status' in res && res.status === 'success';
}

/**
 * 쿠키 조회
 * @param name 쿠키 이름
 * @returns 쿠키 값
*/
export function getCookie(name: string) {
  return Cookies.get(name) ?? null
}

/**
 * 쿠키 등록
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param options 쿠키 등록 옵션
*/
export function setCookie(name: string, value: string, options?: CookiesOptions) {
  Cookies.set(name, value, options)
}

/** 
 * 쿠키 삭제
 * @param name 쿠키 이름
 * @param options 쿠키 삭제 옵션
*/
export function deleteCookie(name: string, options?: CookiesOptions) {
  Cookies.remove(name, options)
}

/**
 * HTTP 통신 에러를 처리하는 공통 함수
 * @param err 발생한 에러 객체
 * @param errorMessage 에러 발생 시 로그에 표시할 메시지
 */
export function handleApiError(err: unknown, errorMessage: string): never {
  logError(`${errorMessage}: ${err}`);
  throw err instanceof Error ? err : new Error(String(err));
}