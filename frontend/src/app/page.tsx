'use client';

import { Layout } from '@/shared/ui/layout';
import { ReviewForm } from '@/shared/ui/review-form';
import dynamic from 'next/dynamic';
import { InviteFormModal } from '@/features/collaboration/ui/invite-form-modal';
import { ToastsWrapper } from '@/features/toasts/ui/toasts-wrapper';
import { CreateWorkspaceModal } from '@/features/workspace/ui/create-workspace-modal';
import LeftSection from '@/widgets/leftSection/ui/left-section';

// monaco-editor 서버 사이드 렌더링 문제 해결을 위한 동적 임포트
const CodeEditorWrapper = dynamic(
  () => import('@/features/code-editor/ui/code-editor-wrapper').then(mod => mod.CodeEditorWrapper),
  { ssr: false }
);

export default function CodeEditorPage() {
  const handleReviewSubmit = (comment: string) => {
    console.log('리뷰 제출:', comment);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 70%: 기존 레이아웃 */}
      <div className="h-[70%]">
        <Layout
          leftSection={
            <LeftSection />
          }
          mainSection={
            <CodeEditorWrapper />
          }
          rightSection={
            <ReviewForm onSubmit={handleReviewSubmit} />
          }
        />
        <InviteFormModal />
        <CreateWorkspaceModal />
        <ToastsWrapper />
      </div>
    </div>
  );
}
