import { Suspense } from 'react';
import { User } from '@/shared/types/user';
import { CollaboratorListClient } from './collaborator-list-client';

export interface CollaboratorListProps {
  collaborators: User[];
}

export function CollaboratorList({ collaborators }: CollaboratorListProps) {
  return (
    <div className="flex flex-col space-y-4 py-2 px-3">
      <Suspense fallback={
        <div className="flex flex-col space-y-2">
          <div className="rounded-md bg-[#252526]">
            <div className="h-[44px] w-full bg-[#333] animate-pulse rounded"></div>
          </div>
        </div>
      }>
        <CollaboratorListClient collaborators={collaborators} />
      </Suspense>
    </div>
  );
}
