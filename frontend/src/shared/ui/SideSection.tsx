'use client';
import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSideSectionStore } from '@/shared/store/side-section-store';
import { useShallow } from 'zustand/shallow';

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
  const { 
    leftSectionVisible, 
    rightSectionVisible, 
    toggleLeftSection, 
    toggleRightSection,
    setLeftSectionVisible,
    setRightSectionVisible
  } = useSideSectionStore(
    useShallow((state) => ({
      leftSectionVisible: state.leftSectionVisible,
      rightSectionVisible: state.rightSectionVisible,
      toggleLeftSection: state.toggleLeftSection,
      toggleRightSection: state.toggleRightSection,
      setLeftSectionVisible: state.setLeftSectionVisible,
      setRightSectionVisible: state.setRightSectionVisible
    }))
  );
  
  const isVisible = position === 'left' ? leftSectionVisible : rightSectionVisible;
  const toggleVisibility = position === 'left' ? toggleLeftSection : toggleRightSection;
  
  // 초기 상태 설정
  useEffect(() => {
    if (position === 'left') {
      setLeftSectionVisible(initialVisible);
    } else {
      setRightSectionVisible(initialVisible);
    }
  }, [initialVisible, position, setLeftSectionVisible, setRightSectionVisible]);
  
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
        initial={isVisible ? 'visible' : 'hidden'}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={variants}
      >
        {children}
      </motion.div>
    </div>
  );
};
