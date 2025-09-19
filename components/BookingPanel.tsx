// components/BookingPanel.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CalendarClock, SmileIcon, UserRoundCheck } from "lucide-react";
import ScrollParallax from "./ScrollParallax";
import { MappedRoom } from "../lib/roomMapper";

const DATES_SESSION_KEY = "booking:dates";
const DATES_EVENT = "booking:dates:update";

interface BookingPanelProps {
  room: MappedRoom;
  selectedRoomNumberId: string | null;
  selectedRoomNumberLabel: string | null;
  onRoomNumberSelect: (id: string | null, label: string | null) => void;
  openGuestModal: (prefill: Record<string, any>) => void;
  errorMsg: string | null;
  isBookingInProgress: boolean;
  polling: boolean;
  bookingId: string | null;
  allRoomNumbers: any[];
  availableRoomNumbers?: any[] | null;
  countdownLabel?: string | null;
  savePrefillForGuestForm?: (prefill: any) => void;
}

export default function BookingPanel({
  room,
  selectedRoomNumberId,
  selectedRoomNumberLabel,
  onRoomNumberSelect,
  openGuestModal,
  errorMsg,
  isBookingInProgress,
  polling,
  bookingId,
  allRoomNumbers,
  availableRoomNumbers,
  countdownLabel,
  savePrefillForGuestForm,
}: BookingPanelProps) {
  const [arrivalDate, setArrivalDate] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);

  useEffect(() => {
    try {
      sessionStorage.setItem(DATES_SESSION_KEY, JSON.stringify({ arrivalDate: arrivalDate || null, departureDate: departureDate || null }));
      window.dispatchEvent(new Event(DATES_EVENT));
    } catch {}
  }, [arrivalDate, departureDate]);

  const datesSelected = Boolean(arrivalDate && departureDate);
  const canSelectRoomNumber = datesSelected && Array.isArray(availableRoomNumbers) && availableRoomNumbers.length > 0;
  const roomNumberOptions = useMemo(() => {
    if (Array.isArray(availableRoomNumbers) && availableRoomNumbers.length > 0) return availableRoomNumbers;
    return allRoomNumbers ?? [];
  }, [availableRoomNumbers, allRoomNumbers]);

  function handleBookNowClick() {
    const prefill = {
      roomId: room.id,
      roomNumberId: selectedRoomNumberId ?? undefined,
      roomNumber: selectedRoomNumberLabel ?? undefined,
      arrivalDate: arrivalDate || null,
      departureDate: departureDate || null,
      guests,
      rooms,
      totalPrice: room.priceNumbers && Array.isArray(room.priceNumbers) && room.priceNumbers.length ? Math.min(...room.priceNumbers.map(Number)) : 0,
      // leave email/name etc for user to fill in modal
    };

    try {
      sessionStorage.setItem("booking:prefill", JSON.stringify(prefill));
    } catch {}

    if (savePrefillForGuestForm) savePrefillForGuestForm(prefill);
    if (openGuestModal) openGuestModal(prefill);
  }

  return (
    <div className="sticky top-24">
      <ScrollParallax amount={6} className="relative">
        <div className="bg-[#F4F5F6] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Price</div>
              <div className="text-xl font-bold text-red-700">{room.price}</div>
              {room.oldPrice && <div className="text-sm line-through text-gray-400">{room.oldPrice}</div>}
            </div>
            <div className="text-sm text-gray-500">{room.beds ? `${room.beds} Beds` : ""}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="text-[#B1B5C3] w-5 h-5" />
                <div>Arrival</div>
              </div>
              <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2" />
            </div>

            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="text-[#B1B5C3] w-5 h-5" />
                <div>Departure</div>
              </div>
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <UserRoundCheck className="text-[#B1B5C3] w-5 h-5" />
                <div>Guests</div>
              </div>
              <input type="number" min={1} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value || 1)))} className="w-full mt-1 border rounded-md px-2 py-2" />
            </div>

            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <SmileIcon className="text-[#B1B5C3] w-5 h-5" />
                <div>Rooms</div>
              </div>
              <input type="number" min={1} value={rooms} onChange={(e) => setRooms(Math.max(1, Number(e.target.value || 1)))} className="w-full mt-1 border rounded-md px-2 py-2" />
            </div>
          </div>

          {allRoomNumbers && allRoomNumbers.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-medium">Select room number (optional)</label>
              <select
                value={selectedRoomNumberId ?? ""}
                onChange={(e) => {
                  const val = e.target.value || null;
                  const sel = roomNumberOptions.find((rn: any) => String(rn._id ?? rn.id ?? rn.number) === val);
                  onRoomNumberSelect(val, sel?.number ?? null);
                }}
                className="w-full mt-2 border rounded-lg px-3 py-2"
                disabled={!datesSelected || !canSelectRoomNumber}
              >
                <option value="">
                  {datesSelected ? (canSelectRoomNumber ? "Auto-assign (best available)" : "No room numbers for those dates") : "Select arrival & departure"}
                </option>
                {roomNumberOptions.map((rn: any) => {
                  const label = rn.number ?? String(rn._id ?? rn.id ?? "");
                  return (
                    <option key={rn._id ?? rn.id ?? label} value={rn._id ?? rn.id ?? label}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <div className="text-xs text-gray-400 mt-1">
                {datesSelected ? (canSelectRoomNumber ? "Pick a specific room number or let us auto-assign." : "No specific room numbers available — we'll auto-assign.") : "Select arrival & departure to see room numbers."}
              </div>
            </div>
          )}

          {errorMsg && <div className="mt-3 text-sm text-red-600">{errorMsg}</div>}

          <div className="mt-4">
            <button onClick={handleBookNowClick} className="w-full bg-[#b61e2e] text-white py-4 font-semibold rounded-md">
              BOOK NOW
            </button>
          </div>

          {isBookingInProgress && <div className="mt-3 text-sm text-gray-600">Creating booking & initializing payment...</div>}

          {polling && bookingId && (
            <div className="mt-3 text-sm text-gray-600">
              Booking on hold — awaiting payment confirmation.
              {countdownLabel && <div className="text-sm text-red-600 mt-1">Hold expires in {countdownLabel}</div>}
            </div>
          )}
        </div>
      </ScrollParallax>
    </div>
  );
}
