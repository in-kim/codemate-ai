'use client';

import { useEditorStore } from '@/shared/store/editor-store';
import { Language, getLanguages } from '@/shared/api/language';
import { useEffect, useState } from 'react';

export function LanguageSelector() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const language = useEditorStore(state => state.language);
  const setLanguage = useEditorStore(state => state.setLanguage);
  
  // 현재 선택된 언어 정보
  const currentLanguage = languages.find(lang => lang.id === language) || {
    id: language,
    name: language.charAt(0).toUpperCase() + language.slice(1),
    icon: '📄',
    extension: language
  };

  // 언어 목록 가져오기
  useEffect(() => {
    async function fetchLanguages() {
      setIsLoading(true);
      try {
        const data = await getLanguages();
        setLanguages(data);
      } catch (error) {
        console.error('언어 목록 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLanguages();
  }, []);

  // 언어 선택 핸들러
  const handleSelectLanguage = (langId: string) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* 현재 선택된 언어 표시 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-700 transition-colors"
      >
        <span>{currentLanguage.icon}</span>
        <span>{currentLanguage.name}</span>
        <span className="text-xs text-gray-400">▼</span>
      </button>

      {/* 언어 선택 드롭다운 */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-1 bg-[#252526] border border-[#3e3e42] rounded shadow-lg min-w-[150px] z-50">
          {isLoading ? (
            <div className="px-4 py-2 text-gray-400">로딩 중...</div>
          ) : languages.length === 0 ? (
            <div className="px-4 py-2 text-gray-400">언어 목록을 불러올 수 없습니다.</div>
          ) : (
            <ul>
              {languages.map((lang) => (
                <li key={lang.id}>
                  <button
                    onClick={() => handleSelectLanguage(lang.id)}
                    className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors ${
                      lang.id === language ? 'bg-gray-700' : ''
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                    {lang.id === language && (
                      <span className="ml-auto text-green-500">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 