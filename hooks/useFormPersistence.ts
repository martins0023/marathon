// hooks/useFormPersistence.ts
import { useEffect } from "react";
import { GuestDetailsValues, DEFAULTS } from "../types/guestForm";
import { todayISO, addDaysISO } from "../utils/dateHelpers";

interface UsePersistenceProps {
  values: GuestDetailsValues;
  setValues: React.Dispatch<React.SetStateAction<GuestDetailsValues>>;
  persistKey: string | null;
}

export function useFormPersistence({ values, setValues, persistKey }: UsePersistenceProps) {
  // Restore persisted draft on mount
  useEffect(() => {
    if (!persistKey) return;
    
    try {
      const raw = localStorage.getItem(persistKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GuestDetailsValues>;
        setValues((prev) => ({ ...prev, ...parsed }));
      } else {
        // Set sensible date defaults if none exist
        setValues((prev) => ({
          ...prev,
          arrivalDate: prev.arrivalDate || todayISO(),
          departureDate: prev.departureDate || addDaysISO(prev.arrivalDate || todayISO(), 1),
        }));
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }, [persistKey, setValues]);

  // Persist on change
  useEffect(() => {
    if (!persistKey) return;
    
    try {
      localStorage.setItem(persistKey, JSON.stringify(values));
    } catch {
      // Ignore storage errors
    }
  }, [persistKey, values]);

  const clearPersistedData = () => {
    if (!persistKey) return;
    try {
      localStorage.removeItem(persistKey);
    } catch {}
  };

  return { clearPersistedData };
}