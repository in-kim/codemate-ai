import { FC } from 'react';

export const Loading: FC = () => {
  return (
    <div className='fixed flex items-center justify-center h-screen w-full bg-[rgba(0,0,0,0.5)] top-0 left-0 z-999'>
      <div className="flex items-center justify-center w-[22ch] text-xl font-mono text-white whitespace-nowrap overflow-hidden relative">
        <span className="typing-animation block after:content-['CodeMate_is_thinking...']"></span>
        <span className="inline-block w-1 h-5 bg-white ml-1" style={{ animation: 'blink 0.7s infinite' }}></span>
      </div>
    </div>
  );
};

