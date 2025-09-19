// components/form/CountrySelect.tsx
"use client";

import React from "react";
import Image from "next/image";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const COUNTRIES = [
  { code: "NG", name: "Nigeria", prefix: "+234", flag: "/flags/ng.png" },
  { code: "US", name: "United States", prefix: "+1", flag: "/flags/us.png" },
  { code: "GB", name: "United Kingdom", prefix: "+44", flag: "/flags/uk.png" },
];

export default function CountrySelect({ value, onChange, disabled = false }: CountrySelectProps) {
  const selectedCountry = COUNTRIES.find(c => c.code === value);

  return (
    <div className="relative flex-shrink-0">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">
        Country
      </label>
      <div className="relative">
        <select
          id="country"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none border-gray-300 rounded-lg py-3 pl-12 pr-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
          disabled={disabled}
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {selectedCountry && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none flex items-center">
            <Image 
              src={selectedCountry.flag} 
              alt=""
              width={24} 
              height={18} 
              className="rounded-sm" 
            />
          </div>
        )}
      </div>
    </div>
  );
}