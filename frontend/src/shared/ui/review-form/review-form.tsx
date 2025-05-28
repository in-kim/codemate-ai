'use client';

import { useReviewStore } from '@/shared/store/review-store';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface ReviewSuggestion {
  line: number;
  message: string;
}

export function ReviewForm() {
  const reviewHistory = useReviewStore((state) => state.reviewHistory);

  return (
    <div className="flex flex-col space-y-2">
      {/* 리뷰 히스토리 표시 */}
      {reviewHistory.length > 0 && (
        <div>
          <div className="font-bold mb-2 text-xs text--700">리뷰 히스토리</div>
          <ul className="space-y-4 max-h-80 overflow-y-auto">
            {reviewHistory.map((item) => (
              <li key={item.id}>
                <div className="flex items-center mb-1">
                  <span className="text-xs text-white mr-2">{new Date(item.createdAt).toLocaleString()}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{item.language}</span>
                </div>
                <div className="mt-5">
                  <SyntaxHighlighter
                    language={item.language}
                    style={oneDark}
                    customStyle={{ borderRadius: 8, fontSize: 13, padding: 16, margin: 0 }}
                    wrapLongLines={true}
                  >
                    {item.code}
                  </SyntaxHighlighter>
                </div>
                <ul className="space-y-1 mt-4">
                  {item.suggestions.map((s, idx) => (
                    <li key={idx} className="text-xs text-white">
                      <span className="font-mono text-white">line {s.line}:</span> {s.message}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
