import { useShallow } from 'zustand/react/shallow';
import { type StoreApi, useStore } from 'zustand';

export function useShallowStore<T, S>(
  store: StoreApi<S>,
  selector: (state: S) => T
): T {
  return useStore(store, useShallow(selector));
}