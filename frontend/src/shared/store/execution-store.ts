import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IGetExecuteHistoryData } from '../types/code';

export interface IAddExecutionParams extends Pick<IGetExecuteHistoryData, 'codeId' | 'workSpaceId' | 'code' | 'userId' | 'language'> {
  stderr: string;
  exitCode: number;
}

export type TExecutionHistory = IGetExecuteHistoryData & {
  stderr?: string;
  exitCode?: number;
}

export interface IExecutionState {
  history: TExecutionHistory[];
  currentResult: TExecutionHistory | null;
  isExecuting: boolean;
  
  // Actions
  putExecution: (result: IGetExecuteHistoryData[]) => void;
  addExecution: (result: IAddExecutionParams) => void;
  selectExecution: (id: string) => void;
  clearHistory: () => void;
  setIsExecuting: (isExecuting: boolean) => void;
}

export const useExecutionStore = create<IExecutionState>()(
  immer((set) => ({
    history: [] as TExecutionHistory[],
    currentResult: null,
    isExecuting: false,
    
    putExecution: (result: IGetExecuteHistoryData[]) => set((state) => {
      state.history = result
      state.currentResult = result[0];
      state.isExecuting = false;
    }),
    addExecution: (result: IAddExecutionParams) => set((state) => {
      const newExecution = {
        _id: crypto.randomUUID(),
        codeId: result.codeId,
        workSpaceId: result.workSpaceId,
        code: result.code,
        userId: result.userId,
        createdAt: new Date().toISOString(),
        language: result.language,
      }
      state.history.unshift(newExecution); // 최신 실행 결과를 맨 앞에 추가
      state.currentResult = newExecution;
      state.isExecuting = false;
    }),
    selectExecution: (id) => set((state) => {
      const selected = state.history.find(item => item._id === id);
      if (selected) {
        state.currentResult = selected;
      }
    }),
    clearHistory: () => set((state) => {
      state.history = [];
      state.currentResult = null;
    }),
    
    setIsExecuting: (isExecuting) => set((state) => {
      state.isExecuting = isExecuting;
    }),
  }))
); 