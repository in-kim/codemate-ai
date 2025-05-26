'use client';
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SideSectionProps {
  children: ReactNode;
  position: 'left' | 'right';
  initialVisible?: boolean;
  width?: number;
}

export const SideSection = ({
  children,
  position,
  initialVisible = true,
  width = 250,
}: SideSectionProps) => {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // cmd+b (왼쪽 패널) 또는 cmd+l (오른쪽 패널) 단축키 처리
      if (event.metaKey) {
        if (position === 'left' && event.key === 'b') {
          event.preventDefault();
          toggleVisibility();
        } else if (position === 'right' && event.key === 'l') {
          event.preventDefault();
          toggleVisibility();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, toggleVisibility]);

  const variants = {
    visible: { 
      x: 0,
      width: width,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    hidden: { 
      x: position === 'left' ? -width : width,
      width: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <div className="relative h-full">
      <motion.div
        className="h-full overflow-hidden"
        initial={initialVisible ? 'visible' : 'hidden'}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={variants}
      >
        {children}
      </motion.div>
    </div>
  );
};
