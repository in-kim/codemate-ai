'use client';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { useState } from 'react';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  submitButtonText: string;
  cancelButtonText?: string;
  placeholder: string;
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitButtonText,
  cancelButtonText = '취소',
  placeholder
}: FormModalProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSubmit(inputValue.trim());
    setInputValue('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button type="submit">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
