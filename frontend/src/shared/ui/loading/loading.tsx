import { FC } from 'react';

export const Loading: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
};

