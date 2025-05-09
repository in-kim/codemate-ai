import { ReactNode } from 'react';
import { FooterBar } from '../footer-bar';
import { AuthHeaderWrapper } from '@/features/auth/ui/AuthHeaderWrapper';

export interface LayoutProps {
  collaborators: ReactNode;
  editor: ReactNode;
  review: ReactNode;
}

export function Layout({ collaborators, editor, review }: LayoutProps) {
  return (
    <div className="flex flex-col flex-1 bg-[#1e1e1e] text-gray-200 h-screen">
      {/* 상단 Header */}
      <AuthHeaderWrapper />

      {/* 본문 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Collaborators */}
        <aside className="w-1/5 border-r border-[#333] p-4 overflow-y-auto bg-[#252526]">
          {collaborators}
        </aside>

        {/* Code Editor */}
        <main className="w-3/5 p-4 overflow-y-auto">
          {editor}
        </main>

        {/* Review */}
        <aside className="w-1/5 border-l border-[#333] p-4 overflow-y-auto bg-[#252526]">
          {review}
        </aside>
      </div>

      {/* 푸터 영역 */}
      <FooterBar />
    </div>
  );
}
