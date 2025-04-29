import { useEditorStore } from "@/shared/store/editor-store";
import { CodeEditor } from "@/shared/ui/code-editor";
import { useShallow } from "zustand/react/shallow";

export function CodeEditorWrapper() {
  const { code, setCode, setCursorPosition, language, detectAndSetLanguage } = useEditorStore(
    useShallow((state) => ({ code: state.code, setCode: state.setCode, setCursorPosition: state.setCursorPosition, language: state.language, detectAndSetLanguage: state.detectAndSetLanguage }))
  );
  
  const handleCursorPositionChange = (line: number, column: number) => {
    setCursorPosition(line, column);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    detectAndSetLanguage(value);
  }

  return (
    <CodeEditor
      value={code}
      onChange={handleCodeChange}
      onCursorPositionChange={handleCursorPositionChange}
      language={language}
      height="calc(100vh - 80px)" // Header 높이 제외
    />
  );
}
