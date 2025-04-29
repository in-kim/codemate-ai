'use client';

import { Layout } from '@/shared/ui/layout';
import { ReviewForm } from '@/shared/ui/review-form';
import { CodeEditorWrapper } from '@/features/code-editor/ui/code-editor-wrapper';
import { CollaborationWrapper } from '@/features/collaboration/ui/collaboration-wrapper';
import { InviteFormModal } from '@/features/invite-form-modal/ui/invite-form-modal';
import { ToastsWrapper } from '@/features/toasts/ui/toasts-wrapper';

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
