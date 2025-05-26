'use client';

import { ILanguage } from '@/shared/lib/services/languages.service';
import { LanguageItem } from './LanguageItem';

interface LanguageDropdownProps {
  languages: ILanguage[];
  currentLanguageId: string;
  isLoading: boolean; 
  onSelectLanguage: (langId: string) => void;
}

export function LanguageDropdown({ 
  languages, 
  currentLanguageId, 
  isLoading, 
  onSelectLanguage 
}: LanguageDropdownProps) {
  if (isLoading) {
    return <div className="px-4 py-2 text-gray-400">로딩 중...</div>;
  }
  
  if (languages.length === 0) {
    return <div className="px-4 py-2 text-gray-400">언어 목록을 불러올 수 없습니다.</div>;
  }
  
  return (
    <ul>
      {languages.map((lang) => (
        <LanguageItem
          key={lang.id}
          language={lang}
          isSelected={lang.id === currentLanguageId}
          onSelect={onSelectLanguage}
        />
      ))}
    </ul>
  );
}
