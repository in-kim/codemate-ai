'use client';

import { cn } from '@/shared/lib/utils';
import ControlledEditor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

export interface CodeEditorProps {
  value: string;
  language?: string;
  onChange: (value: string) => void;
  onMount: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onCursorPositionChange?: (line: number, column: number) => void;
  height?: string;
  children?: React.ReactNode;
}

export function CodeEditor({
  value,
  language = 'javascript',
  onChange,
  onMount,
  onCursorPositionChange,
  height = '100%',
  children,
}: CodeEditorProps) {
  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    editor.onDidChangeCursorPosition((e) => {
      onCursorPositionChange?.(e.position.lineNumber, e.position.column);
    });

    onMount?.(editor);
  };

  return (
    <div className={cn('w-full h-full bg-[#1e1e1e]')}>
      <ControlledEditor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          lineNumbers: 'on',
          roundedSelection: false,
          cursorSmoothCaretAnimation: 'on',
        }}
      />
      {children}
    </div>
  );
}
