// hooks/useGuestDetailsForm.ts
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { GuestDetailsValues, DEFAULTS } from "../types/guestForm";
import { validateGuestForm } from "../utils/formValidation";
import { validatePhoneForCountry } from "../utils/phoneValidation";
import { useFormPersistence } from "./useFormPersistence";

interface UseGuestDetailsFormProps {
  initialValues?: Partial<GuestDetailsValues>;
  // NOTE: onSubmit is intentionally NOT called from the hook anymore.
  // The parent should call the booking API (useBookingLogic.handleBookingSubmit).
  persistKey?: string | null;
  redirectTo?: string | null; // unused here but kept for API compatibility
}

export function useGuestDetailsForm({
  initialValues = {},
  persistKey = "guestDetails",
}: UseGuestDetailsFormProps) {
  const [values, setValues] = useState<GuestDetailsValues>({ ...DEFAULTS, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Persist/rehydrate
  const { clearPersistedData } = useFormPersistence({ values, setValues, persistKey });

  const updateField = useCallback(<K extends keyof GuestDetailsValues>(key: K, value: GuestDetailsValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
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

  /**
   * Validate and return normalized payload.
   * Caller (modal/page) will send it to initialize booking endpoint.
   */
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    setSuccessMsg(null);

    const validationErrors = validateGuestForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return null;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = { ...values } as GuestDetailsValues;

      // Normalize phone if possible
      const phoneCheck = validatePhoneForCountry(values.country, values.phone);
      if (phoneCheck.ok && phoneCheck.normalized) {
        payload.phone = phoneCheck.normalized;
      }

      // Ensure guests breakdown exists as array like backend expects
      // Backend expects guest: [{ adults, children }]
      // Our form uses `guests` number; we convert into a sensible default
      const guestsArray = payload["guests"] ?? [
        {
          adults: Math.max(1, Math.floor(Number(payload.guests ?? 1))),
          children: 0,
        },
      ];
      // attach guest array and ensure numeric types
      const normalizedGuest = Array.isArray(guestsArray)
        ? guestsArray.map((g: any) => ({
            adults: Number(g.adults ?? 0),
            children: Number(g.children ?? 0),
          }))
        : [
            {
              adults: Math.max(1, Math.floor(Number(payload.guests ?? 1))),
              children: 0,
            },
          ];

      // Build final return object the parent expects
      const resultPayload = {
        firstName: payload.firstName ?? "",
        lastName: payload.lastName ?? "",
        email: payload.email ?? "",
        phone: payload.phone ?? "",
        country: payload.country ?? "NG",
        arrivalDate: payload.arrivalDate ?? "",
        departureDate: payload.departureDate ?? "",
        guests: Number(payload.guests ?? 1),
        rooms: Number(payload.rooms ?? 1),
        specialRequests: payload.specialRequests ?? "",
        totalPrice: Number(payload.totalPrice ?? 0),
        guest: normalizedGuest,
      };

      setLoading(false);
      return resultPayload;
    } catch (err) {
      setLoading(false);
      setErrors({ form: "Unexpected error validating form" });
      return null;
    }
  }, [values, clearPersistedData]);

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
