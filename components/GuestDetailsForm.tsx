// components/GuestDetailsForm.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { TimerReset } from "lucide-react";

/**
 * GuestDetailsForm
 *
 * - Reusable, typed guest details form component.
 * - Wires into a mock booking API (mockBookingApi) and shows loading states.
 * - Adds country-aware phone validation for a few common countries (NG/US/GB).
 * - Provides a nicer date-range picker UX (two-date inputs + presets + human-readable summary).
 * - Persists draft to localStorage (optional).
 * - Exposes onSubmit callback and optional redirect after success.
 *
 * Drop into `components/GuestDetailsForm.tsx` and import where needed.
 */

/* ----------------------------- Types & Defaults -------------------------- */

export type GuestDetailsValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string; // country code: "NG" | "US" | "GB"
  arrivalDate: string; // yyyy-mm-dd
  departureDate: string; // yyyy-mm-dd
  guests: number;
  rooms: number;
  specialRequests?: string;
};

export interface GuestDetailsFormProps {
  initialValues?: Partial<GuestDetailsValues>;
  onSubmit?: (values: GuestDetailsValues) => Promise<void> | void;
  className?: string;
  persistKey?: string | null; // if provided, will save/restore draft
  redirectTo?: string | null; // optional redirect path on success
}

const DEFAULTS: GuestDetailsValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "NG",
  arrivalDate: "",
  departureDate: "",
  guests: 1,
  rooms: 1,
  specialRequests: "",
};

/* ----------------------------- Helpers ---------------------------------- */

const todayISO = () => new Date().toISOString().split("T")[0];
const addDaysISO = (d: string, days: number) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().split("T")[0];
};

/**
 * Mock booking API - simulates network request
 * resolves with { success: true } after a timeout; 10% chance to fail
 */
async function mockBookingApi(payload: GuestDetailsValues) {
  // simulate network latency
  await new Promise((res) => setTimeout(res, 1200));
  // simulate random failure (10%)
  if (Math.random() < 0.1) {
    const err: any = new Error("Network error - please try again");
    err.status = 502;
    throw err;
  }
  return { success: true, bookingId: `MOCK-${Math.floor(Math.random() * 1000000)}` };
}

/**
 * Basic country-aware phone validation.
 * This is intentionally simple — for production use libphonenumber-js.
 */
function validatePhoneForCountry(country: string | undefined, phoneRaw: string | undefined) {
  if (!phoneRaw || !phoneRaw.trim()) return { ok: true, normalized: "" };

  const digits = phoneRaw.replace(/\D+/g, "");
  // minimum/maximum digit lengths per country (very approximate)
  const rules: Record<string, { min: number; max: number; code: string }> = {
    NG: { min: 10, max: 13, code: "234" }, // 10 local, or 13 with 234
    US: { min: 10, max: 11, code: "1" }, // 10 local or 11 w/1
    GB: { min: 10, max: 12, code: "44" }, // approx
  };

  const r = rules[country ?? "NG"] ?? rules["NG"];
  if (digits.length < r.min || digits.length > r.max) {
    return { ok: false, message: `Phone number seems invalid for ${country || "selected country"}.` };
  }
  // basic prefix check: if it contains the country code as prefix then ok
  if (digits.startsWith(r.code) || digits.length === r.min) {
    return { ok: true, normalized: "+" + (digits.startsWith(r.code) ? digits : r.code + digits) };
  }
  return { ok: true, normalized: "+" + digits };
}

/* ----------------------------- Validation -------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/* ----------------------------- Component --------------------------------- */

export default function GuestDetailsForm({
  initialValues = {},
  onSubmit,
  className = "",
  persistKey = "guestDetails",
  redirectTo = "/checkout",
}: GuestDetailsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<GuestDetailsValues>({ ...DEFAULTS, ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof GuestDetailsValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // restore persisted draft
  useEffect(() => {
    if (!persistKey) return;
    try {
      const raw = localStorage.getItem(persistKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GuestDetailsValues>;
        setValues((prev) => ({ ...prev, ...parsed }));
      } else {
        // if no arrival/departure prefilled, set sensible defaults
        setValues((prev) => ({
          ...prev,
          arrivalDate: prev.arrivalDate || todayISO(),
          departureDate: prev.departureDate || addDaysISO(prev.arrivalDate || todayISO(), 1),
        }));
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey]);

  // persist on change
  useEffect(() => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, JSON.stringify(values));
    } catch {
      // ignore
    }
  }, [persistKey, values]);

  const update = <K extends keyof GuestDetailsValues>(k: K, v: GuestDetailsValues[K]) => {
    setValues((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setSuccessMsg(null);
  };

  const quickSetNights = (n: number) => {
    const start = values.arrivalDate || todayISO();
    const end = addDaysISO(start, n);
    update("departureDate", end);
  };

  const validate = (): boolean => {
    const err: Partial<Record<keyof GuestDetailsValues, string>> = {};

    if (!values.firstName.trim()) err.firstName = "First name is required.";
    if (!values.lastName.trim()) err.lastName = "Last name is required.";

    if (!values.email.trim()) err.email = "Email is required.";
    else if (!EMAIL_RE.test(values.email.trim())) err.email = "Enter a valid email address.";

    // phone validation (optional but if provided, check)
    const phoneCheck = validatePhoneForCountry(values.country, values.phone);
    if (!phoneCheck.ok) err.phone = phoneCheck.message || "Invalid phone number.";

    if (!values.arrivalDate) err.arrivalDate = "Arrival date is required.";
    if (!values.departureDate) err.departureDate = "Departure date is required.";

    if (values.arrivalDate && values.departureDate) {
      const a = new Date(values.arrivalDate);
      const d = new Date(values.departureDate);
      if (isNaN(a.getTime()) || isNaN(d.getTime())) {
        err.arrivalDate = err.arrivalDate ?? "Invalid date.";
        err.departureDate = err.departureDate ?? "Invalid date.";
      } else if (d <= a) {
        err.departureDate = "Departure must be after arrival.";
      }
    }

    if (!Number.isInteger(values.guests) || values.guests < 1) err.guests = "Please enter at least 1 guest.";
    if (!Number.isInteger(values.rooms) || values.rooms < 1) err.rooms = "Please enter at least 1 room.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      // call mock API
      const payload = { ...values };
      // normalize phone (if any)
      const phoneCheck = validatePhoneForCountry(values.country, values.phone);
      if (phoneCheck.ok && phoneCheck.normalized) {
        payload.phone = phoneCheck.normalized;
      }

      const res = await mockBookingApi(payload);

      setSuccessMsg(`Booking prepared (${(res as any).bookingId}). Redirecting...`);
      // clear persisted draft
      if (persistKey) {
        try {
          localStorage.removeItem(persistKey);
        } catch {}
      }

      // forward to onSubmit if provided (allow parent to do further work)
      if (onSubmit) {
        await onSubmit(payload);
      }

      // small delay to show success then redirect if requested
      setTimeout(() => {
        setLoading(false);
        if (redirectTo) {
          // use router from next/router
          try {
            // router may not be available in some contexts, fallback to location
            (router as any).push ? (router as any).push(redirectTo) : (window.location.href = redirectTo);
          } catch {
            window.location.href = redirectTo;
          }
        } else {
          setSuccessMsg("Saved successfully.");
        }
      }, 800);
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrors({ ...(err?.fieldErrors || {}), email: err?.message || "Failed to prepare booking. Try again." });
      setLoading(false);
    }
  };

  /* ----------------------------- UI -------------------------------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl p-6 shadow-sm ${className}`}
      noValidate
      aria-labelledby="guest-details-heading"
    >
      <h3 id="guest-details-heading" className="text-2xl pt-20 font-bold mb-6">
        Guest details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="firstName">
            First name <span className="text-red-600">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={values.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.firstName ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            placeholder="First name"
            required
            disabled={loading}
          />
          {errors.firstName && (
            <p id="firstName-error" className="mt-2 text-sm text-red-600">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastName">
            Last name <span className="text-red-600">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={values.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.lastName ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            placeholder="Last name"
            required
            disabled={loading}
          />
          {errors.lastName && (
            <p id="lastName-error" className="mt-2 text-sm text-red-600">
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
            Email address <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.email ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Country & Phone */}
        <div className="flex gap-3 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">
              Country
            </label>
            <select
              id="country"
              value={values.country}
              onChange={(e) => update("country", e.target.value)}
              className="rounded-md border-gray-200 py-3"
              disabled={loading}
            >
              <option value="NG">Nigeria (+234)</option>
              <option value="US">United States (+1)</option>
              <option value="GB">United Kingdom (+44)</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                errors.phone ? "border-red-400" : "border-gray-200"
              }`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              placeholder={values.country === "NG" ? "e.g. 08123456789 or +2348123456789" : "e.g. +1 555 555 5555"}
              disabled={loading}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Arrival & Departure (date-range picker with presets) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="arrivalDate">
            Arrival date <span className="text-red-600">*</span>
          </label>
          <input
            id="arrivalDate"
            name="arrivalDate"
            type="date"
            value={values.arrivalDate || todayISO()}
            onChange={(e) => {
              const newArrival = e.target.value;
              // ensure departure is after arrival
              const dep = values.departureDate && new Date(values.departureDate) > new Date(newArrival)
                ? values.departureDate
                : addDaysISO(newArrival, 1);
              update("arrivalDate", newArrival);
              update("departureDate", dep);
            }}
            min={todayISO()}
            className={`w-full border rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.arrivalDate ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.arrivalDate}
            aria-describedby={errors.arrivalDate ? "arrivalDate-error" : undefined}
            disabled={loading}
            required
          />
          {errors.arrivalDate && (
            <p id="arrivalDate-error" className="mt-2 text-sm text-red-600">
              {errors.arrivalDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="departureDate">
            Departure date <span className="text-red-600">*</span>
          </label>
          <input
            id="departureDate"
            name="departureDate"
            type="date"
            value={values.departureDate || addDaysISO(values.arrivalDate || todayISO(), 1)}
            onChange={(e) => update("departureDate", e.target.value)}
            min={values.arrivalDate ? addDaysISO(values.arrivalDate, 1) : addDaysISO(todayISO(), 1)}
            className={`w-full border rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.departureDate ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.departureDate}
            aria-describedby={errors.departureDate ? "departureDate-error" : undefined}
            disabled={loading}
            required
          />
          {errors.departureDate && (
            <p id="departureDate-error" className="mt-2 text-sm text-red-600">
              {errors.departureDate}
            </p>
          )}
        </div>

        {/* Presets: quick buttons */}
        <div className="md:col-span-2 flex gap-2 items-center">
          <span className="text-sm text-gray-500">Quick stay:</span>
          <button type="button" onClick={() => quickSetNights(1)} disabled={loading} className="px-3 py-1 rounded-md border text-sm">
            1 night
          </button>
          <button type="button" onClick={() => quickSetNights(2)} disabled={loading} className="px-3 py-1 rounded-md border text-sm">
            2 nights
          </button>
          <button type="button" onClick={() => quickSetNights(3)} disabled={loading} className="px-3 py-1 rounded-md border text-sm">
            3 nights
          </button>

          {/* human readable summary */}
          <div className="ml-auto text-sm text-gray-600">
            {values.arrivalDate && values.departureDate ? (
              <span>
                {values.arrivalDate} → {values.departureDate} ({Math.max(1, (new Date(values.departureDate).getTime() - new Date(values.arrivalDate).getTime()) / (1000 * 60 * 60 * 24))} nights)
              </span>
            ) : (
              <span>Choose dates</span>
            )}
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="guests">
            Guests <span className="text-red-600">*</span>
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            value={values.guests}
            onChange={(e) => update("guests", Math.max(1, Number(e.target.value || 1)))}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.guests ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.guests}
            aria-describedby={errors.guests ? "guests-error" : undefined}
            disabled={loading}
            required
          />
          {errors.guests && (
            <p id="guests-error" className="mt-2 text-sm text-red-600">
              {errors.guests}
            </p>
          )}
        </div>

        {/* Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="rooms">
            Rooms <span className="text-red-600">*</span>
          </label>
          <input
            id="rooms"
            name="rooms"
            type="number"
            min={1}
            value={values.rooms}
            onChange={(e) => update("rooms", Math.max(1, Number(e.target.value || 1)))}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.rooms ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.rooms}
            aria-describedby={errors.rooms ? "rooms-error" : undefined}
            disabled={loading}
            required
          />
          {errors.rooms && (
            <p id="rooms-error" className="mt-2 text-sm text-red-600">
              {errors.rooms}
            </p>
          )}
        </div>

        {/* Special requests */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="specialRequests">
            Special requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={values.specialRequests}
            onChange={(e) => update("specialRequests", e.target.value)}
            rows={4}
            className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 border-gray-200"
            placeholder="Any dietary restrictions, accessibility needs, or special notes..."
            disabled={loading}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center px-6 py-3 text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-primary hover:bg-[#cf2732]"
            } transition-colors`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Preparing booking...
              </>
            ) : (
              "Continue to booking"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setValues(DEFAULTS);
              setErrors({});
              if (persistKey) {
                try {
                  localStorage.removeItem(persistKey);
                } catch {}
              }
            }}
            className="px-4 py-3 border flex flex- row gap-2 items-center border-gray-200 text-sm"
            disabled={loading}
          >
            <TimerReset className="w-5 h-5 text-gray-800" />
            Reset
          </button>
        </div>

        <p className="text-xs text-gray-500">
          By continuing you agree to our <a className="underline">terms & conditions</a>.
        </p>
      </div>

      {/* success message */}
      <div aria-live="polite" className="relative">
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={successMsg ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.28 }}
          className="absolute right-0 top-4"
        >
          {successMsg && (
            <div className="bg-green-50 text-green-800 border border-green-100 px-4 py-2 rounded-md shadow-sm text-sm">
              {successMsg}
            </div>
          )}
        </motion.div>
      </div>
    </form>
  );
}

/* ----------------------------- Utility ---------------------------------- */

// re-export helpers so unit tests or parents can use them
export { validatePhoneForCountry, mockBookingApi, addDaysISO, todayISO };
