import { create } from 'zustand';

interface SideSectionState {
  leftSectionVisible: boolean;
  rightSectionVisible: boolean;
  toggleLeftSection: () => void;
  toggleRightSection: () => void;
  setLeftSectionVisible: (visible: boolean) => void;
  setRightSectionVisible: (visible: boolean) => void;
}

export const useSideSectionStore = create<SideSectionState>((set) => ({
  leftSectionVisible: true,
  rightSectionVisible: true,
  toggleLeftSection: () => set((state) => ({ leftSectionVisible: !state.leftSectionVisible })),
  toggleRightSection: () => set((state) => ({ rightSectionVisible: !state.rightSectionVisible })),
  setLeftSectionVisible: (visible) => set({ leftSectionVisible: visible }),
  setRightSectionVisible: (visible) => set({ rightSectionVisible: visible }),
}));
