'use client';

import { useEditorStore } from '@/shared/store/editor-store';
import { Language, getLanguages } from '@/shared/api/language';
import { useEffect, useReducer, useCallback } from 'react';
import { LanguageDropdown } from './LanguageDropdown';

// 상태 타입 정의
interface LanguageSelectorState {
  languages: Language[];
  currentLanguage: Language | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

// 액션 타입 정의
type LanguageSelectorAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { languages: Language[]; currentLanguage: Language } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'TOGGLE_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' };

// 초기 상태
const initialState: LanguageSelectorState = {
  languages: [],
  currentLanguage: null,
  isOpen: false,
  isLoading: true,
  error: null
};

// 리듀서 함수
function languageSelectorReducer(state: LanguageSelectorState, action: LanguageSelectorAction): LanguageSelectorState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        languages: action.payload.languages,
        currentLanguage: action.payload.currentLanguage,
        isLoading: false,
        error: null
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'TOGGLE_DROPDOWN':
      return { ...state, isOpen: !state.isOpen };
    case 'CLOSE_DROPDOWN':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export function LanguageSelector() {
  const [state, dispatch] = useReducer(languageSelectorReducer, initialState);
  const { languages, currentLanguage, isOpen, isLoading } = state;
  
  const language = useEditorStore(state => state.language);
  const setLanguage = useEditorStore(state => state.setLanguage);

  // 언어 목록 가져오기
  const fetchLanguages = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const languages = await getLanguages();
      const currentLanguage = languages.find(lang => lang.id === language) || {
        id: language,
        name: language.charAt(0).toUpperCase() + language.slice(1),
        icon: '📄',
        extension: language
      };
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { languages, currentLanguage }
      });
    } catch (error) {
      console.error('언어 목록 로딩 실패:', error);
      dispatch({
        type: 'FETCH_ERROR',
        payload: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }, [language]);
  
  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  // 언어 선택 핸들러
  const handleSelectLanguage = (langId: string) => {
    setLanguage(langId);
    dispatch({ type: 'CLOSE_DROPDOWN' });
  };

  // 드롭다운 토글 핸들러
  const toggleDropdown = () => {
    dispatch({ type: 'TOGGLE_DROPDOWN' });
  };

  return (
    <div className="relative">
      {/* 현재 선택된 언어 표시 */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{currentLanguage?.icon}</span>
        <span>{currentLanguage?.name}</span>
        <span className="text-xs text-gray-400">▼</span>
      </button>

      {/* 언어 선택 드롭다운 */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-1 bg-[#252526] border border-[#3e3e42] rounded shadow-lg min-w-[150px] z-50" role="menu">
          <LanguageDropdown
            languages={languages}
            currentLanguageId={language}
            isLoading={isLoading}
            onSelectLanguage={handleSelectLanguage}
          />
        </div>
      )}
    </div>
  );
} 