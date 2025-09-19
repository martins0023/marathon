// components/GuestDetailsForm.tsx
"use client";

import React, { useEffect } from "react";
import { GuestDetailsFormProps } from "../types/guestForm";
import { useGuestDetailsForm } from "../hooks/useGuestDetailsForm";

// Form components
import FormInput from "./form/FormInput";
import CountrySelect from "./form/CountrySelect";
import PhoneInput from "./form/PhoneInput";
import DateRangePicker from "./form/DateRangePicker";
import FormActions from "./form/FormActions";

export default function GuestDetailsForm({
  initialValues = {},
  onSubmit,
  className = "",
  persistKey = "guestDetails",
}: GuestDetailsFormProps) {
  const {
    values,
    errors,
    loading,
    successMsg,
    updateField,
    resetForm,
    handleSubmit: hookHandleSubmit,
  } = useGuestDetailsForm({
    initialValues,
    persistKey,
  });

  // Apply initialValues to form fields (simple sync)
  useEffect(() => {
    if (!initialValues) return;
    if (initialValues.email) updateField("email", initialValues.email);
    if (initialValues.firstName) updateField("firstName", initialValues.firstName);
    if (initialValues.lastName) updateField("lastName", initialValues.lastName);
    if (initialValues.phone) updateField("phone", initialValues.phone);
    if (initialValues.country) updateField("country", initialValues.country);
    if (initialValues.arrivalDate) updateField("arrivalDate", initialValues.arrivalDate);
    if (initialValues.departureDate) updateField("departureDate", initialValues.departureDate);
    if (initialValues.guests) updateField("guests", initialValues.guests);
    if (initialValues.rooms) updateField("rooms", initialValues.rooms);
    if (initialValues.totalPrice !== undefined) updateField("totalPrice", initialValues.totalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  async function submitHandler(e?: React.FormEvent) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const validated = await hookHandleSubmit();
    if (!validated) return;
    if (onSubmit) {
      await onSubmit(validated);
    }
  }

  return (
    <form onSubmit={submitHandler} className={`bg-white rounded-xl p-6 shadow-sm ${className}`} noValidate>
      <h3 className="text-2xl font-semibold mb-4">Guest details & booking</h3>
      <p className="text-sm text-gray-500 mb-6">Fill in guest details to continue to booking.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput id="firstName" name="firstName" label="First name" value={values.firstName} onChange={(v) => updateField("firstName", v)} error={errors.firstName} required disabled={loading} />
        <FormInput id="lastName" name="lastName" label="Last name" value={values.lastName} onChange={(v) => updateField("lastName", v)} error={errors.lastName} required disabled={loading} />

        <FormInput id="email" name="email" type="email" inputMode="email" label="Email" value={values.email} onChange={(v) => updateField("email", v)} error={errors.email} required disabled={loading} className="md:col-span-2" />

        <div className="md:col-span-2 flex gap-4">
          <CountrySelect value={values.country || "NG"} onChange={(v) => updateField("country", v)} disabled={loading} />
          <PhoneInput value={values.phone || ""} onChange={(v) => updateField("phone", v)} country={values.country || "NG"} error={errors.phone} disabled={loading} />
        </div>

        <DateRangePicker
          arrivalDate={values.arrivalDate}
          departureDate={values.departureDate}
          onArrivalChange={(v) => updateField("arrivalDate", v)}
          onDepartureChange={(v) => updateField("departureDate", v)}
          arrivalError={errors.arrivalDate}
          departureError={errors.departureDate}
          disabled={loading}
        />

        <FormInput id="guests" name="guests" type="number" label="Guests" value={values.guests} onChange={(v) => updateField("guests", Math.max(1, Number(v || 1)))} error={errors.guests} required disabled={loading} />
        <FormInput id="rooms" name="rooms" type="number" label="Rooms" value={values.rooms} onChange={(v) => updateField("rooms", Math.max(1, Number(v || 1)))} error={errors.rooms} required disabled={loading} />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Special requests</label>
          <textarea value={values.specialRequests || ""} onChange={(e) => updateField("specialRequests", e.target.value)} rows={4} className="w-full border rounded-md px-4 py-3" disabled={loading} />
        </div>
      </div>

      <div className="mt-4">
        <FormActions loading={loading} successMsg={successMsg} onReset={resetForm} />
      </div>
    </form>
  );
}
