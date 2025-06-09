'use client';

import { useExecutionStore } from '@/shared/store/execution-store';
import { formatDistance } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

export function Terminal() {
  const { history, currentResult, isExecuting } = useExecutionStore(
    useShallow((state) => ({
      history: state.history,
      currentResult: state.currentResult,
      isExecuting: state.isExecuting,
    }))
  );
  const selectExecution = useExecutionStore(state => state.selectExecution);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 결과가 업데이트될 때 스크롤을 아래로 이동
  useEffect(() => {
    if (terminalRef.current && currentResult) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentResult]);

  // 언어별 아이콘 표시
  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'python':
        return '🐍';
      case 'javascript':
        return '🟨';
      default:
        return '📄';
    }
  };

  // 종료 코드 기반 상태 표시
  const getStatusIcon = (exitCode: number) => {
    return exitCode === 0 ? '✅' : '❌';
  };

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    return formatDistance(new Date(timestamp), new Date(), {
      addSuffix: true,
      locale: ko,
    });
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* 실행 히스토리 (좌측 2) */}
      <div className="w-2/10 border-r border-[#333]">
        <div className="py-2 px-3 bg-[#252526] font-bold text-sm">실행 히스토리</div>
        <div className="overflow-y-auto h-[calc(100%-30px)]">
          {history.length === 0 ? (
            <div className="p-3 text-gray-500 text-sm">실행 히스토리가 없습니다.</div>
          ) : (
            <ul>
              {history.map((item) => (
                <li
                  key={item._id}
                  className={`p-2 text-xs border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                    currentResult?._id === item._id ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => selectExecution(item._id)}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {getLanguageIcon(item.language)} {getStatusIcon(item.exitCode || 0)}
                    </span>
                    <span className="text-gray-500">{formatTime(item.createdAt)}</span>
                  </div>
                  <div className="mt-1 text-gray-400 truncate">{item.code.slice(0, 30)}{item.code.length > 30 ? '...' : ''}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 실행 결과 (우측 8) */}
      <div className="w-8/10 flex flex-col h-full">
        <div className="py-2 px-3 bg-[#252526] font-bold text-sm flex justify-between">
          <span>실행 결과</span>
          {isExecuting && (
            <span className="text-yellow-400 animate-pulse">실행 중...</span>
          )}
        </div>
        <div
          ref={terminalRef}
          className="flex-1 p-3 font-mono text-sm overflow-y-auto bg-[#1e1e1e]"
        >
          {currentResult ? (
            <div>
              {/* 명령어 */}
              <div className="text-gray-400 mb-2">
                $ {getLanguageIcon(currentResult.language)} 
                {currentResult.language === 'python' ? ' python' : ' node'} 
                <span className="text-green-400"> script.{currentResult.language === 'python' ? 'py' : 'js'}</span>
              </div>

              {/* 표준 출력 */}
              {currentResult.code && (
                <pre className="whitespace-pre-wrap mb-2 text-green-300">{currentResult.code}</pre>
              )}

              {/* 표준 에러 */}
              {currentResult.stderr && (
                <pre className="whitespace-pre-wrap text-red-400">{currentResult.stderr}</pre>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {isExecuting ? '코드를 실행 중입니다...' : '아직 실행된 코드가 없습니다.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 