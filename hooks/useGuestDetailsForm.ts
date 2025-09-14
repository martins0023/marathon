// hooks/useGuestDetailsForm.ts
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { GuestDetailsValues, DEFAULTS } from "../types/guestForm";
import { validateGuestForm } from "../utils/formValidation";
import { validatePhoneForCountry } from "../utils/phoneValidation";
import { mockBookingApi } from "../services/bookingApi";
import { useFormPersistence } from "./useFormPersistence";

interface UseGuestDetailsFormProps {
  initialValues?: Partial<GuestDetailsValues>;
  onSubmit?: (values: GuestDetailsValues) => Promise<void> | void;
  persistKey?: string | null;
  redirectTo?: string | null;
}

export function useGuestDetailsForm({
  initialValues = {},
  onSubmit,
  persistKey = "guestDetails",
  redirectTo = "/checkout",
}: UseGuestDetailsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<GuestDetailsValues>({ ...DEFAULTS, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form persistence hook
  const { clearPersistedData } = useFormPersistence({ values, setValues, persistKey });

  const updateField = useCallback(<K extends keyof GuestDetailsValues>(
    key: K, 
    value: GuestDetailsValues[K]
  ) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    setSuccessMsg(null);
  }, []);

  const resetForm = useCallback(() => {
    setValues(DEFAULTS);
    setErrors({});
    setSuccessMsg(null);
    clearPersistedData();
  }, [clearPersistedData]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Validate form
    const validationErrors = validateGuestForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare payload with normalized phone
      const payload = { ...values };
      const phoneCheck = validatePhoneForCountry(values.country, values.phone);
      if (phoneCheck.ok && phoneCheck.normalized) {
        payload.phone = phoneCheck.normalized;
      }

      // Call mock API
      const response = await mockBookingApi(payload);

      setSuccessMsg(`Booking prepared (${response.bookingId}). Redirecting...`);
      clearPersistedData();

      // Call parent onSubmit if provided
      if (onSubmit) {
        await onSubmit(payload);
      }

      // Redirect after success
      setTimeout(() => {
        setLoading(false);
        if (redirectTo) {
          try {
            if (router.push) {
              router.push(redirectTo);
            } else {
              window.location.href = redirectTo;
            }
          } catch {
            window.location.href = redirectTo;
          }
        } else {
          setSuccessMsg("Saved successfully.");
        }
      }, 800);
    } catch (error: any) {
      console.error("Booking error:", error);
      setErrors({
        ...(error?.fieldErrors || {}),
        email: error?.message || "Failed to prepare booking. Try again."
      });
      setLoading(false);
    }
  }, [values, onSubmit, redirectTo, router, clearPersistedData]);

  return {
    values,
    errors,
    loading,
    successMsg,
    updateField,
    resetForm,
    handleSubmit,
  };
}