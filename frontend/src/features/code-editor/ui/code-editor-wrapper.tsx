'use client';

import { useEditorStore } from "@/shared/store/editor-store";
import { CodeEditor } from "@/shared/ui/code-editor";
import { useReviewStore } from "@/shared/store/review-store";
import { useShallow } from "zustand/react/shallow";
import { debounce } from "@/shared/lib/debounce";
import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useRef, useState } from "react";
import { fetcher } from "@/shared/lib/fetcher";
import { useSocket } from "@/shared/hooks/useSocket";
import {useAuthStore} from "@/shared/store/auth-store";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { executeCode, IExecutionResponse } from '@/shared/lib/services/execution.service';
import { useExecutionStore } from '@/shared/store/execution-store';
import { useToastStore } from '@/shared/store/toast-store';
import { HttpResponse } from '@/shared/types/response';
import { useLoadingStore } from "@/shared/store/loading-store";

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
  const user = useAuthStore(useShallow((state) => ({ userInfo: state.userInfo })));
  const {selectedWorkspaceId} = useWorkspaceStore(useShallow((state) => ({ selectedWorkspaceId: state.selectedWorkspaceId })));
  const { addExecution } = useExecutionStore();
  const { addToast } = useToastStore(useShallow((state) => ({ addToast: state.addToast })));
  const [isExecutingFetching, setIsExecutingFetching] = useState(false);
  /**
   * 커서 위치 변경 시 실행
   * @param line 줄
   * @param column 열
   */
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const {isLoading, startLoading, stopLoading} = useLoadingStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      startLoading: state.startLoading,
      stopLoading: state.stopLoading
    }))
  )

  const { sendSync } = useSocket({
    workSpaceId: selectedWorkspaceId as string,
    userId: user.userInfo?.username as string,
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
      const selection = event.selection as monaco.Selection;
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
    sendSync({ payload: value });
  };

  // zustand 리뷰 스토어
  const addReview = useReviewStore((state) => state.addReview);
  // const [inlineOpenLine, setInlineOpenLine] = useState<number | null>(null);

  /**
   * 선택한 코드 리뷰 요청
   */
  const handleRequestReview = async () => {
    if (!selectedText) return;

    try {
      startLoading();
      const response = await fetcher<ReviewResponse>("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: selectedText, language }),
      });

      if (isHttpResponseSuccess<ReviewResponseItem[]>(response)) {
        // 응답 파싱
        const suggestions: { line: number; message: string }[] = [];
        for (const item of response.data) {
          for (const part of item?.content?.parts) {
            try {
              const text = JSON.parse(part?.text);
              if (text.suggestions && text.suggestions.length > 0) {
                suggestions.push(...text.suggestions);
              }
            } catch (error) {
              console.error("리뷰 결과 파싱 오류:", error);
            }
          }
        }
        // zustand store에 리뷰 결과 저장
        addReview({
          code: selectedText,
          language,
          suggestions,
        });
        setSelectedText("");
      }
    } catch (error) {
      console.error("리뷰 요청 실패:", error);
    } finally {
      stopLoading();
    }
  };

  // 코드 실행 함수
  const handleExecuteCode = useCallback(async () => {
    const errorMessageMap = {
      'no-code': '코드를 입력해주세요.',
      'no-auth': '로그인이 필요합니다.',
    }

    const errorValidateArr = [
      {
        condition: !code.trim(),
        message: errorMessageMap['no-code'],
      },
      {
        condition: !useAuthStore.getState().getIsLogin(),
        message: errorMessageMap['no-auth'],
      } 
    ]

    const isError = errorValidateArr.some(({ condition, message }) => {
      if (condition) addToast(message, 'error');
      
      return condition;
    });

    if (isError) return;
    
    try {
      setIsExecutingFetching(true);
      const result:HttpResponse<IExecutionResponse> = await executeCode(code, language, user.userInfo?.userId as string, selectedWorkspaceId as string);
      
      // 실행 결과 저장
      addExecution({
        code,
        language,
        stdout: result.data.stdout,
        stderr: result.data.stderr,
        exitCode: result.data.exitCode
      });
    } catch (error) {
      console.error('코드 실행 오류:', error);
    } finally {
      setIsExecutingFetching(false);
    }
  }, [code, addToast, language, addExecution, selectedWorkspaceId, user]);

  // 이벤트 핸들러 등록 상태를 추적하기 위한 ref 사용
  const keyHandlerRef = useRef(false);

  // cmd+s 저장 기능 차단을 위한 전역 함수
  useEffect(() => {
    // 이미 등록되어 있다면 추가 등록 안함
    if (keyHandlerRef.current) return;

    // 기본 저장 동작 차단을 위한 함수
    function preventSave(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        e.stopPropagation();
        
        // 코드 에디터에 포커스가 있을 때만 실행 코드 호출
        if (document.activeElement?.closest('.monaco-editor')) {
          handleExecuteCode();
        }
        return false;
      }
    }

    // 캡처 단계에서 이벤트 처리
    document.addEventListener('keydown', preventSave, true);
    keyHandlerRef.current = true;

    return () => {
      document.removeEventListener('keydown', preventSave, true);
      keyHandlerRef.current = false;
    };
  }, [handleExecuteCode]);

  useEffect(() => {
    if (!editorRef.current) return;
  
    const disposable = editorRef.current.onDidChangeModelContent((event: monaco.editor.IModelContentChangedEvent) => {
      const modifiedLines = new Set<number>();
  
      event.changes.forEach((change: monaco.editor.IModelContentChange) => {
        modifiedLines.add(change.range.startLineNumber);
        modifiedLines.add(change.range.endLineNumber);
      });
  
    });
    
    return () => {
      disposable.dispose();
    };
  }, []);
  

  return (
    <div className="relative w-full h-full flex">
      {/* 코드 에디터 영역 */}
      <div className="flex-1 relative">
        <div className="py-4">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            onCursorPositionChange={handleCursorPositionChange}
            language={language}
            height="calc(100vh - 80px)"
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={handleExecuteCode}
                disabled={isExecutingFetching}
                className="px-2 py-1 bg-green-600 text-white rounded shadow hover:bg-[#76FF03] transition mr-2 text-xs"
              >
                {isExecutingFetching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                ) : (
                  "▶ Run (⌘+S)"
                )}
              </button>
              {selectedText && (
                <button
                  onClick={handleRequestReview}
                  className="px-2 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition text-xs"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  ) : (
                    "선택한 코드 리뷰 요청"
                  )}
                </button>
              )}
            </div>
          </CodeEditor>
        </div>
      </div>
    </div>
  );
}
