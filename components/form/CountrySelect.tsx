// components/form/CountrySelect.tsx
"use client";

import React from "react";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const COUNTRIES = [
  { code: "NG", name: "Nigeria", prefix: "+234" },
  { code: "US", name: "United States", prefix: "+1" },
  { code: "GB", name: "United Kingdom", prefix: "+44" },
];

export default function CountrySelect({ value, onChange, disabled = false }: CountrySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">
        Country
      </label>
      <select
        id="country"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border-gray-200 py-3"
        disabled={disabled}
      >
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.prefix})
          </option>
        ))}
      </select>
    </div>
  );
}