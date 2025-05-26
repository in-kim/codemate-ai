declare module 'monaco-editor' {
  export = monaco;
}

declare namespace monaco {
  export namespace editor {
    export interface IStandaloneCodeEditor {
      getModel(): monaco.editor.ITextModel | null;
      onDidChangeCursorSelection(listener: (e: monaco.editor.ICursorSelectionChangedEvent) => void): IDisposable;
      onDidChangeModelContent(listener: (e: monaco.editor.IModelContentChangedEvent) => void): IDisposable;
      setValue(value: string): void;
      getSelection(): monaco.Selection;
      deltaDecorations(oldDecorations: string[], newDecorations: monaco.editor.IModelDeltaDecoration[]): string[];
      revealLineInCenter(lineNumber: number): void;
      focus(): void;
    }
    
    export interface ICursorSelectionChangedEvent {
      selection: monaco.Selection;
      secondarySelections: monaco.Selection[];
      source: string;
      reason: number;
    }

    export interface ITextModel {
      getValueInRange(range: monaco.Range): string;
      getValue(): string;
      setValue(value: string): void;
    }

    export interface IModelDeltaDecoration {
      range: monaco.Range;
      options: monaco.editor.IModelDecorationOptions;
    }

    export interface IModelDecorationOptions {
      className?: string;
      inlineClassName?: string;
      marginClassName?: string;
      isWholeLine?: boolean;
      hoverMessage?: monaco.IMarkdownString | monaco.IMarkdownString[];
      linesDecorationsClassName?: string;
      glyphMarginClassName?: string;
      overviewRulerColor?: string;
      overviewRulerLane?: OverviewRulerLane;
      stickiness?: TrackedRangeStickiness;
    }

    export interface IModelContentChangedEvent {
      changes: IModelContentChange[];
    }

    export interface IModelContentChange {
      range: monaco.Range;
      rangeOffset: number;
      rangeLength: number;
      text: string;
    }

    export enum OverviewRulerLane {
      Left = 1,
      Center = 2,
      Right = 4,
      Full = 7
    }

    export enum TrackedRangeStickiness {
      AlwaysGrowsWhenTypingAtEdges = 0,
      NeverGrowsWhenTypingAtEdges = 1,
      GrowsOnlyWhenTypingBefore = 2,
      GrowsOnlyWhenTypingAfter = 3
    }
  }

  export interface IDisposable {
    dispose(): void;
  }

  export interface IMarkdownString {
    value: string;
    isTrusted?: boolean;
  }

  export class Range {
    constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number);
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  }

  export class Selection extends Range {
    constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number);
    selectionStartLineNumber: number;
    selectionStartColumn: number;
    positionLineNumber: number;
    positionColumn: number;
  }
}
