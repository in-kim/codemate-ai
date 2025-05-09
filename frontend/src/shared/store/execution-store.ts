import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface ExecutionResult {
  id: string;
  code: string;
  language: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timestamp: number;
}

interface ExecutionState {
  history: ExecutionResult[];
  currentResult: ExecutionResult | null;
  isExecuting: boolean;
  
  // Actions
  addExecution: (result: Omit<ExecutionResult, 'id' | 'timestamp'>) => void;
  selectExecution: (id: string) => void;
  clearHistory: () => void;
  setExecuting: (isExecuting: boolean) => void;
}

export const useExecutionStore = create<ExecutionState>()(
  immer((set) => ({
    history: [],
    currentResult: null,
    isExecuting: false,
    
    addExecution: (result) => set((state) => {
      const newExecution: ExecutionResult = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      
      state.history.unshift(newExecution); // 최신 실행 결과를 맨 앞에 추가
      state.currentResult = newExecution;
      state.isExecuting = false;
      
      // 히스토리 최대 20개로 제한
      if (state.history.length > 20) {
        state.history = state.history.slice(0, 20);
      }
    }),
    
    selectExecution: (id) => set((state) => {
      const selected = state.history.find(item => item.id === id);
      if (selected) {
        state.currentResult = selected;
      }
    }),
    
    clearHistory: () => set((state) => {
      state.history = [];
      state.currentResult = null;
    }),
    
    setExecuting: (isExecuting) => set((state) => {
      state.isExecuting = isExecuting;
    }),
  }))
); 