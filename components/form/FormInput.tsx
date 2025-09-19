// components/form/FormInput.tsx
"use client";

import React from "react";

interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
  min?: string | number;
}

export default function FormInput({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  className = "",
  inputMode,
  min,
}: FormInputProps) {
  return (
    <div className={`relative ${className}`}>
      <label
        className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200"
        htmlFor={id}
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent
        ${error ? "border-red-400" : "border-gray-300"}
        ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}