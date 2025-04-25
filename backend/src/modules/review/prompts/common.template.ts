export function buildReviewPrompt(language: string, code: string): string {
  return `
    You are a code reviewer.
    You will be given a piece of code and your task is to review the code and provide feedback.
    lease analyze the following ${language} code and provide:
    1. A summary of code quality.
    2. Specific suggestions categorized by line number:
        - style / performance / security / clarity
    3. Improve the code if necessary.
    4. without any Markdown formatting, code blocks, or additional text
    4. 답변은 한국어로 해줘
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Return the response in JSON with this format:
    {
      "summary": "short overall review",
      "suggestions": [
        {
          "line": 3,
          "type": "style",
          "message": "Use clearer variable names."
        }
      ]
    }

  `;
}
