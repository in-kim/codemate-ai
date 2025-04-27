'use client';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';

export interface InviteFormProps {
  onInvite: (userName: string) => void;
  onCancel: () => void;
}

export function InviteForm({ onInvite, onCancel }: InviteFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onInvite(name.trim());
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">초대하기</h2>
      <Input
        placeholder="사용자 이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          초대
        </Button>
      </div>
    </form>
  );
}
