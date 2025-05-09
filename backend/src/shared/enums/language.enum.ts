/**
 * 지원하는 프로그래밍 언어 목록
 */
export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
}

/**
 * 언어별 표시 이름
 */
export const LanguageDisplayNames: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.JAVASCRIPT]: 'JavaScript',
  [ProgrammingLanguage.PYTHON]: 'Python',
};

/**
 * 언어별 아이콘 (이모지)
 */
export const LanguageIcons: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.JAVASCRIPT]: '🟨',
  [ProgrammingLanguage.PYTHON]: '🐍',
};

/**
 * 언어별 파일 확장자
 */
export const LanguageExtensions: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.JAVASCRIPT]: 'js',
  [ProgrammingLanguage.PYTHON]: 'py',
};
