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
    <>
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

      {/* Quick preset buttons */}
      <div className="md:col-span-2 flex gap-2 items-center">
        <span className="text-sm text-gray-500">Quick stay:</span>
        <button 
          type="button" 
          onClick={() => quickSetNights(1)} 
          disabled={disabled} 
          className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          1 night
        </button>
        <button 
          type="button" 
          onClick={() => quickSetNights(2)} 
          disabled={disabled} 
          className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          2 nights
        </button>
        <button 
          type="button" 
          onClick={() => quickSetNights(3)} 
          disabled={disabled} 
          className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          3 nights
        </button>
      </div>

      {/* Date summary */}
      <div className="md:col-span-2 text-sm text-gray-600">
        {arrivalDate && departureDate ? (
          <span>
            {arrivalDate} → {departureDate} ({nights} nights)
          </span>
        ) : (
          <span className="text-red-600">Choose dates</span>
        )}
      </div>
    </>
  );
}