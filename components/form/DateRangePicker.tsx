// components/form/DateRangePicker.tsx
"use client";

import React from "react";
import FormInput from "./FormInput";
import { todayISO, addDaysISO, calculateNights } from "../../utils/dateHelpers";

interface DateRangePickerProps {
  arrivalDate: string;
  departureDate: string;
  onArrivalChange: (date: string) => void;
  onDepartureChange: (date: string) => void;
  arrivalError?: string;
  departureError?: string;
  disabled?: boolean;
}

export default function DateRangePicker({
  arrivalDate,
  departureDate,
  onArrivalChange,
  onDepartureChange,
  arrivalError,
  departureError,
  disabled = false,
}: DateRangePickerProps) {
  const handleArrivalChange = (newArrival: string) => {
    onArrivalChange(newArrival);
    
    // Ensure departure is after arrival
    const currentDeparture = departureDate;
    if (currentDeparture && new Date(currentDeparture) <= new Date(newArrival)) {
      onDepartureChange(addDaysISO(newArrival, 1));
    }
  };

  const quickSetNights = (nights: number) => {
    if (disabled) return;
    const start = arrivalDate || todayISO();
    const end = addDaysISO(start, nights);
    onDepartureChange(end);
  };

  const nights = calculateNights(arrivalDate, departureDate);

  return (
    <div className="md:col-span-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date inputs */}
        <FormInput
          id="arrivalDate"
          name="arrivalDate"
          type="date"
          label="Arrival date"
          value={arrivalDate || todayISO()}
          onChange={handleArrivalChange}
          error={arrivalError}
          required
          disabled={disabled}
          min={todayISO()}
        />

        <FormInput
          id="departureDate"
          name="departureDate"
          type="date"
          label="Departure date"
          value={departureDate || addDaysISO(arrivalDate || todayISO(), 1)}
          onChange={onDepartureChange}
          error={departureError}
          required
          disabled={disabled}
          min={arrivalDate ? addDaysISO(arrivalDate, 1) : addDaysISO(todayISO(), 1)}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Quick preset buttons */}
        <span className="text-sm text-gray-500">Quick stay:</span>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button 
              key={n}
              type="button" 
              onClick={() => quickSetNights(n)} 
              disabled={disabled} 
              className={`px-4 py-2 rounded-full border border-gray-300 text-sm font-medium
                hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${nights === n ? "bg-gray-100" : ""}`}
            >
              {n} night{n > 1 ? "s" : ""}
            </button>
          ))}
        </div>

        {/* Date summary */}
        <div className="flex-1 text-right text-sm text-gray-600 mt-2 sm:mt-0">
          {arrivalDate && departureDate ? (
            <span>
              {nights} night{nights > 1 ? "s" : ""} selected
            </span>
          ) : (
            <span className="text-red-600">Choose dates</span>
          )}
        </div>
      </div>
    </div>
  );
}