/**
 * 지원하는 프로그래밍 언어 목록
 */
export enum ProgrammingLanguage {
  PLAINTEXT = 'plaintext',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  GO = 'go',
}

/**
 * 언어별 표시 이름
 */
export const LanguageDisplayNames: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.PLAINTEXT]: 'Plain Text',
  [ProgrammingLanguage.JAVASCRIPT]: 'JavaScript',
  [ProgrammingLanguage.TYPESCRIPT]: 'TypeScript',
  [ProgrammingLanguage.PYTHON]: 'Python',
  [ProgrammingLanguage.JAVA]: 'Java',
  [ProgrammingLanguage.GO]: 'Go',
};

/**
 * 언어별 아이콘 (이모지)
 */
export const LanguageIcons: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.PLAINTEXT]: '📄',
  [ProgrammingLanguage.JAVASCRIPT]: '🟨',
  [ProgrammingLanguage.TYPESCRIPT]: '🟨',
  [ProgrammingLanguage.PYTHON]: '🐍',
  [ProgrammingLanguage.JAVA]: '☕️',
  [ProgrammingLanguage.GO]: '☕️',
};

/**
 * 언어별 파일 확장자
 */
export const LanguageExtensions: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.PLAINTEXT]: 'txt',
  [ProgrammingLanguage.JAVASCRIPT]: 'js',
  [ProgrammingLanguage.TYPESCRIPT]: 'ts',
  [ProgrammingLanguage.PYTHON]: 'py',
  [ProgrammingLanguage.JAVA]: 'java',
  [ProgrammingLanguage.GO]: 'go',
};
