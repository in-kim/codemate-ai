'use client';

import { useState } from 'react';
// import { cn } from '@/shared/lib/utils';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export interface ReviewFormProps {
  onSubmit: (comment: string) => void;
}

export function ReviewForm() {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length === 0) {
      setError('코멘트를 입력해주세요.');
      return;
    }

    setError('');
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <Input
        label="Review Comment"
        placeholder="코멘트를 입력하세요"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        error={error}
      />
      <Button type="submit" className="self-end">
        Submit
      </Button>
    </form>
  );
}
