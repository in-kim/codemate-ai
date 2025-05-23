// store/useLoadingStore.ts
import {create} from 'zustand'

interface LoadingStore {
  loadingCount: number
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  loadingCount: 0,
  isLoading: false,

  startLoading: () => {
    const count = get().loadingCount + 1
    set({ loadingCount: count, isLoading: true })
  },

  stopLoading: () => {
    const count = Math.max(get().loadingCount - 1, 0)
    set({ 
      loadingCount: count, 
      isLoading: count > 0 
    })
  },
}))
