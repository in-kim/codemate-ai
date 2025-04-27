'use client';

import { Layout } from '@/shared/ui/layout';
import { CollaboratorList } from '@/shared/ui/collaborator-list';
import { CodeEditor } from '@/shared/ui/code-editor';
import { ReviewForm } from '@/shared/ui/review-form';
import { useState } from 'react';
import { Modal } from '@/shared/ui/modal';
import { InviteForm } from '@/shared/ui/invite-form';
import { useEditorStore } from '@/shared/store/editor-store';
import { useCollaboratorStore } from '@/shared/store/collaborator-store';
import { useModalStore } from '@/shared/store/modal-store';
import { useToastStore } from '@/shared/store/toast-store';
import { Toast } from '@/shared/ui/toast';

export default function CodeEditorPage() {
  const [line, setLine] = useState(1); 
  const [column, setColumn] = useState(1);

  // 사용
  const { code, setCode, setCursorPosition, language } = useEditorStore();
  const { collaborators, addCollaborator } = useCollaboratorStore();
  const { isInviteModalOpen, openInviteModal, closeInviteModal } = useModalStore();
  const { toasts, addToast, removeToast } = useToastStore();

  const handleRun = () => {
    console.log('Run 클릭! 현재 코드:', code);
  };

  const handleReviewSubmit = (comment: string) => {
    console.log('리뷰 제출:', comment);
  };

  const handleCursorPositionChange = (line: number, column: number) => {
    setLine(line);
    setColumn(column);
  };

  const handleInviteClick = () => openInviteModal();

  const handleInviteUser = (userName: string) => {
    addCollaborator(userName);
    addToast(`'${userName}' 님을 초대했습니다!`, 'success');
    closeInviteModal()
  };

  return (
    <div className="flex flex-col h-screen">
      <Layout
        collaborators={
          <CollaboratorList
            collaborators={collaborators}
            onInviteClick={handleInviteClick}
          />
        }
        editor={
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value)}
            onCursorPositionChange={handleCursorPositionChange}
            language="typescript"
            height="calc(100vh - 80px)" // Header 높이 제외
          />
        }
        review={
          <ReviewForm onSubmit={handleReviewSubmit} />
        }
        line={line}
        column={column}
        language={language}
      />
      <Modal isOpen={isInviteModalOpen} onClose={closeInviteModal}>
        <InviteForm onInvite={handleInviteUser} onCancel={closeInviteModal} />
      </Modal>
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
        {
          toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))
        }
      </div>
    </div>
  );
}
