/**
 * 여러 className 문자열을 조건부로 합쳐주는 유틸리티
 * ex) cn('base', isActive && 'active', isError && 'error')
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}