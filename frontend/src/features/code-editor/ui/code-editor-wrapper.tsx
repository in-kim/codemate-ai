'use client';

import { useEditorStore } from "@/shared/store/editor-store";
import { CodeEditor } from "@/shared/ui/code-editor";
import { useShallow } from "zustand/react/shallow";
import { debounce } from "@/shared/lib/debounce";
import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from "react";
import { fetcher } from "@/shared/lib/fetcher";
import { useSocket } from "@/shared/hooks/useSocket";

// 리뷰 API 응답 타입 정의
interface ReviewResponsePart {
  text: string;
}

interface ReviewContentPart {
  parts: ReviewResponsePart[];
}

interface ReviewResponseItem {
  content: ReviewContentPart;
}

interface ReviewResponse {
  data: ReviewResponseItem[];
}


export function CodeEditorWrapper() {
  const { code, setCode, setCursorPosition, language, detectAndSetLanguage } = useEditorStore(
    useShallow((state) => ({ code: state.code, setCode: state.setCode, setCursorPosition: state.setCursorPosition, language: state.language, detectAndSetLanguage: state.detectAndSetLanguage }))
  );
  
  /**
   * 커서 위치 변경 시 실행
   * @param line 줄
   * @param column 열
   */
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [decorations, setDecorations] = useState<string[]>([]);
  // TODO: github 정보 연결
  const { sendSync } = useSocket({
    documentId: 'test-doc',
    userId: 'test-user',
    onMessage: (data: unknown) => {
      const msg = data as { type: string, payload: string };
      if (msg.type === 'UPDATE' && typeof msg.payload === 'string') {
        const editor = editorRef.current;
        if (!editor) return;
        const model = editor.getModel();
        if (!model) return;

        // 수신된 코드 내용으로 전체 덮어쓰기
        model.setValue(msg.payload);
      }

    }
  });

   /**
   * 커서 위치 변경 시 실행
   * @param line 줄
   * @param column 열
   */
  const handleCursorPositionChange = (line: number, column: number) => {
    setCursorPosition(line, column);
  };

  /**
   * 코드 에디터 마운트 시 실행
   * @param editor 코드 에디터
   */
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorSelection((event) => {
      const selection = event.selection;
      const selected = editor.getModel()?.getValueInRange(selection) || '';

      // 너무 짧은 선택은 무시 (2글자 미만)
      if (selected.trim().length > 1) {
        setSelectedText(selected);
      } else {
        setSelectedText('');
      }
    });
  };

  /**
   * 코드 변경 시 실행
   * @param value 변경된 코드
   */
  const debouncedDetectAndSetLanguage = debounce((value: unknown) => {
    if (typeof value === 'string') {
      detectAndSetLanguage(value);
    }
  }, 300);

  /**
   * 코드 변경 시 실행
   * @param value 변경된 코드
   */
  const handleCodeChange = (value: string) => {
    setCode(value);
    debouncedDetectAndSetLanguage(value);
    sendSync(value);
  };

  /**
   * 선택한 코드 리뷰 요청
   */
  const handleRequestReview = async () => {
    if (!selectedText) return;

    try {
      setIsLoading(true);
      const response = await fetcher<ReviewResponse>('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: selectedText, language }),
      });

      // 응답 파싱
      for (const item of response.data) {
        for (const part of item?.content?.parts) {
          try {
            const text = JSON.parse(part?.text);
            if (editorRef.current && text.suggestions && text.suggestions.length > 0) {
              const model = editorRef.current.getModel();
              if (model) {
                const newDecorations = text.suggestions.map((suggestion: { line: number; message: string }) => ({
                  range: new monaco.Range(
                    suggestion.line, 
                    1, 
                    suggestion.line, 
                    1
                  ),
                  options: {
                    isWholeLine: true,
                    className: 'review-line-highlight',
                    hoverMessage: {
                      value: suggestion.message,
                    },
                  },
                }));
                const newDecorationIds = editorRef.current.deltaDecorations(decorations, newDecorations);
                setDecorations(newDecorationIds);
              }
            }

            setSelectedText('');
          } catch (error) {
            console.error('리뷰 결과 파싱 오류:', error);
          }
        }
      }
    } catch (error) {
      console.error('리뷰 요청 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;
  
    const disposable = editorRef.current.onDidChangeModelContent((event) => {
      const modifiedLines = new Set<number>();
  
      event.changes.forEach((change) => {
        modifiedLines.add(change.range.startLineNumber);
        modifiedLines.add(change.range.endLineNumber);
      });
  
    });
  
    return () => {
      disposable.dispose();
    };
  }, []);
  

  return (
    <div className="relative w-full h-full">
      <CodeEditor
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
        onCursorPositionChange={handleCursorPositionChange}
        language={language}
        height="calc(100vh - 80px)" // Header 높이 제외
      >
        {selectedText && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleRequestReview}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              ) : (
                '선택한 코드 리뷰 요청'
              )}
            </button>
          </div>
        )}
      </CodeEditor>
    </div>
  );
}
