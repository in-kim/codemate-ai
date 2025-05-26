import { useLoadingStore } from "@/shared/store/loading-store";

export default function useFullpageLoader() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return isLoading;
}
