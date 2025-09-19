// components/form/PhoneInput.tsx
"use client";

import React from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country: string;
  error?: string;
  disabled?: boolean;
}

export default function PhoneInput({ 
  value, 
  onChange, 
  country, 
  error, 
  disabled = false 
}: PhoneInputProps) {
  const getPlaceholder = (countryCode: string) => {
    switch (countryCode) {
      case "NG":
        return "e.g. 812 345 6789";
      case "US":
        return "e.g. 555-555-5555";
      case "GB":
        return "e.g. 7123 456789";
      default:
        return "Enter phone number";
    }
  };

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
        Phone number
      </label>
      <input
        id="phone"
        name="phone"
        type="tel"
        inputMode="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent
        ${error ? "border-red-400" : "border-gray-300"}
        ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? "phone-error" : undefined}
        placeholder={getPlaceholder(country)}
        disabled={disabled}
      />
      {error && (
        <p id="phone-error" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}