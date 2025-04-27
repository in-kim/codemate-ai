interface LanguagePattern {
  language: string;
  patterns: RegExp[];
}

const languagePatterns: LanguagePattern[] = [
  {
    language: 'typescript',
    patterns: [
      /\binterface\b/, 
      /\btype\b/, 
      /\bimplements\b/, 
      /\bextends\b/,
      /\bfunction\s+\w+\s*\([^)]*:[^)]+\)/,
      /const\s+\w+\s*=\s*\(\s*(\w+\s*:\s*\w+\s*,\s*)*(\w+\s*:\s*\w+\s*)\)\s*=>\s*\{/,
    ],
  },
  {
    language: 'javascript',
    patterns: [
      /\bfunction\s+\w+\s*\(\s*\w+\s*\)/,
      /\bconst\b/, 
      /\blet\b/, 
      /=>/, 
      /\bconsole\.log\b/, 
      /\bimport\b.*from\b/,
    ],
  },
  {
    language: 'python',
    patterns: [
      /\bdef\b/, 
      /\bclass\b/, 
      /\bimport\b/, 
      /\bself\b/,
      /:\s*$/, // 콜론으로 끝나는 패턴
    ],
  },
  {
    language: 'html',
    patterns: [
      /<html>/i, 
      /<div>/i, 
      /<p>/i, 
      /<b>/i, 
      /<strong>/i, 
      /<em>/i, 
      /<a>/i,
      /<img>/i,
      /<ul>/i,
      /<ol>/i,
      /<li>/i,
      /<h1>/i,
      /<h2>/i,
      /<h3>/i,
      /<h4>/i,
      /<h5>/i,
      /<h6>/i,
      /<table>/i,
      /<tr>/i,
      /<td>/i,
      /<th>/i,
      /<thead>/i,
      /<tbody>/i,
      /<tfoot>/i,
      /<caption>/i,
      /<form>/i,
      /<input>/i,
      /<textarea>/i,
      /<select>/i,
      /<option>/i,
      /<label>/i,
      /<button>/i,
      /<script>/i,
      /<style>/i,
      /<link>/i,
      /<meta>/i,
      /<title>/i,
      /<head>/i,
      /<body>/i,
      /<footer>/i,
      /<nav>/i,
      /<section>/i,
      /<article>/i,
      /<aside>/i,
      /<main>/i,
      /<header>/i,
      /<!DOCTYPE html>/i,
    ],
  },
  {
    language: 'css',
    patterns: [
      /\bcolor:/, 
      /\bbackground:/, 
      /\bmargin:/, 
      /\bpadding:/,
    ],
  },
  {
    language: 'json',
    patterns: [
      /^\s*\{/, 
      /\}$/, 
      /":\s*"/,
    ],
  },
  {
    language: 'bash',
    patterns: [
      /#!/, 
      /\becho\b/, 
      /\bls\b/, 
      /\bcd\b/,
    ],
  },
  {
    language: 'go',
    patterns: [
      /\bpackage main\b/, 
      /\bfunc main\(\)/, 
      /\bimport "fmt"\b/,
    ],
  },
  {
    language: 'java',
    patterns: [
      /\bpublic class\b/, 
      /\bSystem\.out\.println\b/, 
      /\bvoid main\(/,
    ],
  },
  {
    language: 'cpp',
    patterns: [
      /#include\s*<.*>/, 
      /\bstd::/, 
      /\bint main\(\)/,
    ],
  },
  {
    language: 'markdown',
    patterns: [
      /^# /, 
      /^## /, 
      /^- /, 
      /\*\*(.*?)\*\*/,
    ],
  },
];


export function detectLanguage(code: string): string {
  for (const { language, patterns } of languagePatterns) {
    if (patterns.some((pattern) => pattern.test(code))) {
      return language;
    }
  }
  return 'plaintext';
}