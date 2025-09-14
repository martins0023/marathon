// components/GuestDetailsForm.tsx (Main Component)
"use client";

import React from "react";
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
  redirectTo = "/checkout",
}: GuestDetailsFormProps) {
  const {
    values,
    errors,
    loading,
    successMsg,
    updateField,
    resetForm,
    handleSubmit,
  } = useGuestDetailsForm({
    initialValues,
    onSubmit,
    persistKey,
    redirectTo,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl p-6 shadow-sm ${className}`}
      noValidate
      aria-labelledby="guest-details-heading"
    >
      <h3 id="guest-details-heading" className="text-2xl font-semibold mb-4">
        Guest details & booking
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Fill in guest details to continue to booking. Selected offer will be pre-filled where applicable.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name fields */}
        <FormInput
          id="firstName"
          name="firstName"
          label="First name"
          value={values.firstName}
          onChange={(value) => updateField("firstName", value)}
          error={errors.firstName}
          required
          disabled={loading}
          placeholder="First name"
        />

        <FormInput
          id="lastName"
          name="lastName"
          label="Last name"
          value={values.lastName}
          onChange={(value) => updateField("lastName", value)}
          error={errors.lastName}
          required
          disabled={loading}
          placeholder="Last name"
        />

        {/* Email */}
        <FormInput
          id="email"
          name="email"
          type="email"
          inputMode="email"
          label="Email address"
          value={values.email}
          onChange={(value) => updateField("email", value)}
          error={errors.email}
          required
          disabled={loading}
          placeholder="you@example.com"
          className="md:col-span-2"
        />

        {/* Country and Phone */}
        <div className="flex gap-3 items-start">
          <CountrySelect
            value={values.country || "NG"}
            onChange={(value) => updateField("country", value)}
            disabled={loading}
          />
        </div>

        <PhoneInput
          value={values.phone || ""}
          onChange={(value) => updateField("phone", value)}
          country={values.country || "NG"}
          error={errors.phone}
          disabled={loading}
        />

        {/* Date range picker */}
        <DateRangePicker
          arrivalDate={values.arrivalDate}
          departureDate={values.departureDate}
          onArrivalChange={(value) => updateField("arrivalDate", value)}
          onDepartureChange={(value) => updateField("departureDate", value)}
          arrivalError={errors.arrivalDate}
          departureError={errors.departureDate}
          disabled={loading}
        />

        {/* Guests and rooms */}
        <FormInput
          id="guests"
          name="guests"
          type="number"
          label="Guests"
          value={values.guests}
          onChange={(value) => updateField("guests", Math.max(1, Number(value || 1)))}
          error={errors.guests}
          required
          disabled={loading}
          min={1}
        />

        <FormInput
          id="rooms"
          name="rooms"
          type="number"
          label="Rooms"
          value={values.rooms}
          onChange={(value) => updateField("rooms", Math.max(1, Number(value || 1)))}
          error={errors.rooms}
          required
          disabled={loading}
          min={1}
        />

        {/* Special requests */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="specialRequests">
            Special requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={values.specialRequests || ""}
            onChange={(e) => updateField("specialRequests", e.target.value)}
            rows={4}
            className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 border-gray-200"
            placeholder="Any dietary restrictions, accessibility needs, or special notes..."
            disabled={loading}
          />
        </div>
      </div>

      {/* Form actions */}
      <FormActions 
        loading={loading} 
        successMsg={successMsg} 
        onReset={resetForm} 
      />
    </form>
  );
}

// Re-export types and utilities for external use
export type { GuestDetailsValues, GuestDetailsFormProps } from "../types/guestForm";
export { validatePhoneForCountry } from "../utils/phoneValidation";