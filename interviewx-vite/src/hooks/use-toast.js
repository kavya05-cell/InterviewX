import { useState, useCallback } from "react";

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default", duration = 4000 }) => {
    const id = ++toastCount;
    const newToast = { id, title, description, variant };
    setToasts((prev) => [...prev.slice(-4), newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, toasts, dismiss };
}
