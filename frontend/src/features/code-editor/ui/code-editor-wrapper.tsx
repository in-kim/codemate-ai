import { useSocket } from "@/shared/hooks/useSocket";
import { useEditorStore } from "@/shared/store/editor-store";
import { CodeEditor } from "@/shared/ui/code-editor";
import { useShallow } from "zustand/react/shallow";
import { useRef } from "react";
import * as monaco from 'monaco-editor';

export function CodeEditorWrapper() {
  const { code, setCode, setCursorPosition, language, detectAndSetLanguage } = useEditorStore(
    useShallow((state) => ({ code: state.code, setCode: state.setCode, setCursorPosition: state.setCursorPosition, language: state.language, detectAndSetLanguage: state.detectAndSetLanguage }))
  );
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

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

  const handleCursorPositionChange = (line: number, column: number) => {
    setCursorPosition(line, column);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    sendSync(value);
    detectAndSetLanguage(value);
  }

  return (
    <CodeEditor
      ref={editorRef}
      value={code}
      onChange={handleCodeChange}
      onCursorPositionChange={handleCursorPositionChange}
      language={language}
      height="calc(100vh - 80px)" // Header 높이 제외
    />
  );
}
