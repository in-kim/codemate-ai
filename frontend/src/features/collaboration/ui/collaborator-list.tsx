import { cn } from '@/shared/lib/utils';

export interface Collaborator {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

export interface CollaboratorListProps {
  collaborators: Collaborator[];
}

export function CollaboratorList({ collaborators }: CollaboratorListProps) {
  return (
    <div className="flex flex-col space-y-4 py-2 px-3">
      <div className="flex flex-col space-y-2">
        {collaborators.length > 0 ? (
          collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-md bg-[#252526] hover:bg-[#333]',
              )}
            >
              <span className="text-sm">{collaborator.name}</span>
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  collaborator.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
                )}
              />
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">협업자가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
