import { ReactNode } from 'react';
import { FooterBar } from '../footer-bar';
import { AuthHeaderWrapper } from '@/features/auth/ui/AuthHeaderWrapper';
import { Terminal } from '@/features/terminal';
import { SideSection } from '../SideSection';


export interface LayoutProps {
  leftSection: ReactNode;
  mainSection: ReactNode;
  rightSection: ReactNode;
}

export function Layout({ leftSection, mainSection, rightSection }: LayoutProps) {
  return (
    <div className="flex flex-col flex-1 bg-[#1e1e1e] text-gray-200 h-screen">
      {/* 상단 Header */}
      <AuthHeaderWrapper />

      {/* 본문 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* leftSection */}
        <SideSection position="left" initialVisible={true} width={350}>
          <aside className="w-full h-full border-r border-[#333] overflow-y-auto bg-[#252526]">
            {leftSection}
          </aside>
        </SideSection>

        {/* Code mainSection */}
        <main className="w-full h-full overflow-y-auto">
          {mainSection}
        </main>

        {/* Review */}
        <SideSection position="right" initialVisible={true} width={350}>
          <aside className="w-full h-full border-l border-[#333] p-4 overflow-y-auto bg-[#252526]">
            {rightSection}
          </aside>
        </SideSection>
      </div>

      {/* 하단 30%: 터미널 */}
      <div className="h-[30%] border-t border-gray-700">
        <Terminal />
      </div>

      {/* 푸터 영역 */}
      <FooterBar />
    </div>
  );
}
