import { buildReviewPrompt as buildCommon } from './common.template';

export function getPrompt(language: string, code: string) {
  switch (language) {
    case 'javascript':
    case 'python':
      return buildCommon(language, code);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}
