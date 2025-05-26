"use client";
import { useToastStore } from "@/shared/store/toast-store";
import { Toast } from "@/shared/ui/toast";
import { useShallow } from "zustand/shallow";

export function ToastsWrapper() {
  const { toasts, removeToast } = useToastStore(useShallow((state) => ({ toasts: state.toasts, removeToast: state.removeToast})));

  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}