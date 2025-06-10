import { create } from 'zustand';
import { IReviewResponse } from '../types/code';

export interface ReviewSuggestion {
  line: number;
  message: string;
}

interface ReviewStore {
  reviewHistory: IReviewResponse[];
  addReview: (review: IReviewResponse) => void;
  putReviewHistory: (review: IReviewResponse[]) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  reviewHistory: [],
  addReview: (review) =>
    set((state) => ({
      reviewHistory: [
        {
          ...review,
          _id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...state.reviewHistory,
      ],
    })),
  putReviewHistory: (review) =>
    set(() => ({
      reviewHistory: review,
    })),
}));
