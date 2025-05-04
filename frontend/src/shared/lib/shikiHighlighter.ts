import { createHighlighter } from 'shiki'

export const shikiHighlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'bash', 'java', 'c', 'cpp', 'go', 'markdown']
});
