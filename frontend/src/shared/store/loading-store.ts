// store/useLoadingStore.ts
import {create} from 'zustand'

// 로딩 상태의 최소 표시 시간 (밀리초)
const MIN_LOADING_DURATION = 1000

interface LoadingStore {
  loadingCount: number
  isLoading: boolean
  loadingTimers: Record<string, NodeJS.Timeout>
  startLoading: () => string
  stopLoading: (timerId?: string) => void
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  loadingCount: 0,
  isLoading: false,
  loadingTimers: {},
  
  // 로딩 시작 시 타이머 ID 반환

  startLoading: () => {
    const count = get().loadingCount + 1
    set({ loadingCount: count, isLoading: true })
    
    // 고유한 타이머 ID 생성
    const timerId = Date.now().toString()
    return timerId
  },

  stopLoading: (timerId?: string) => {
    // 타이머 ID가 있는 경우 해당 타이머를 사용하고, 없는 경우 새 타이머 생성
    const newTimerId = timerId || Date.now().toString()
    const timers = { ...get().loadingTimers }
    
    // 이미 실행 중인 타이머가 있다면 제거
    if (timerId && timers[timerId]) {
      clearTimeout(timers[timerId])
      delete timers[timerId]
    }
    
    // 로딩 종료를 위한 새 타이머 설정
    timers[newTimerId] = setTimeout(() => {
      const count = Math.max(get().loadingCount - 1, 0)
      const updatedTimers = { ...get().loadingTimers }
      delete updatedTimers[newTimerId]
      
      set({ 
        loadingCount: count, 
        isLoading: count > 0,
        loadingTimers: updatedTimers
      })
    }, MIN_LOADING_DURATION)
    
    set({ loadingTimers: timers })
  },
}))
