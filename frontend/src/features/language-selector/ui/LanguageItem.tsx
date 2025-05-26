'use client';

import { ILanguage } from '@/shared/lib/services/languages.service';

interface LanguageItemProps {
  language: ILanguage;
  isSelected: boolean;
  onSelect: (langId: string) => void;
}

export function LanguageItem({ language, isSelected, onSelect }: LanguageItemProps) {
  return (
    <li>
      <button
        onClick={() => onSelect(language.id)}
        className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors ${
          isSelected ? 'bg-gray-700' : ''
        }`}
      >
        <span>{language.icon}</span>
        <span>{language.name}</span>
        {isSelected && (
          <span className="ml-auto text-green-500">✓</span>
        )}
      </button>
    </li>
  );
}
