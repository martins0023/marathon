// hooks/useFormPersistence.ts
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

interface UseFormPersistenceProps<T extends Record<string, any>> {
  values: T;
  setValues: Dispatch<SetStateAction<T>>;
  persistKey?: string | null;
}

export function useFormPersistence<T extends Record<string, any>>({ values, setValues, persistKey = "guestDetails" }: UseFormPersistenceProps<T>) {
  useEffect(() => {
    if (!persistKey) return;
    try {
      const raw = sessionStorage.getItem(persistKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setValues((prev: T) => ({ ...prev, ...parsed }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePersistedData = useCallback(() => {
    if (!persistKey) return;
    try {
      sessionStorage.setItem(persistKey, JSON.stringify(values));
    } catch {}
  }, [persistKey, values]);

  const clearPersistedData = useCallback(() => {
    if (!persistKey) return;
    try {
      sessionStorage.removeItem(persistKey);
    } catch {}
  }, [persistKey]);

  return { savePersistedData, clearPersistedData };
}
