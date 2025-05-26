'use client';
import { cn } from '@/shared/lib/utils';
import { User } from '@/shared/types/user';

export interface CollaboratorListProps {
  collaborators: User[];
}

export function CollaboratorList({ collaborators }: CollaboratorListProps) {
  return (
    <div className="flex flex-col space-y-4 py-2 px-3">
      <div className="flex flex-col space-y-2">
        {collaborators.length > 0 ? (
          collaborators.map((collaborator) => (
            <div
              key={collaborator.userId}
              className={cn(
                'flex items-center justify-between p-3 rounded-md bg-[#252526] hover:bg-[#333]',
              )}
            >
              <span className="text-sm">{collaborator.username}</span>
              {/* <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  collaborator.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
                )}
              /> */}
            </div>
          ))
        ) : (
          <div className="text-sm">협업자가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
