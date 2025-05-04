'use client';

import { Layout } from '@/shared/ui/layout';
import { ReviewForm } from '@/shared/ui/review-form';
import dynamic from 'next/dynamic';
import { CollaborationWrapper } from '@/features/collaboration/ui/collaboration-wrapper';
import { InviteFormModal } from '@/features/invite-form-modal/ui/invite-form-modal';
import { ToastsWrapper } from '@/features/toasts/ui/toasts-wrapper';

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
      <Layout
        collaborators={
          <CollaborationWrapper />
        }
        editor={
          <CodeEditorWrapper />
        }
        review={
          <ReviewForm onSubmit={handleReviewSubmit} />
        }
      />
      <InviteFormModal />
      <ToastsWrapper />
    </div>
  );
}
