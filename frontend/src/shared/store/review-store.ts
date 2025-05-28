import { create } from 'zustand';

export interface ReviewSuggestion {
  line: number;
  message: string;
}

export interface ReviewHistoryItem {
  id: string; // uuid 등 고유값
  createdAt: number;
  code: string;
  language: string;
  suggestions: ReviewSuggestion[];
}

interface ReviewStore {
  reviewHistory: ReviewHistoryItem[];
  addReview: (review: Omit<ReviewHistoryItem, 'id' | 'createdAt'>) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  reviewHistory: [],
  addReview: (review) =>
    set((state) => ({
      reviewHistory: [
        {
          ...review,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        },
        ...state.reviewHistory,
      ],
    })),
}));
