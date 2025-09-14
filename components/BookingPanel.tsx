// components/BookingPanel.tsx
"use client";

import React from "react";
import Link from "next/link";
import { CalendarClock, SmileIcon, UserRoundCheck } from "lucide-react";
import ScrollParallax from "./ScrollParallax";
import { MappedRoom } from "../lib/roomMapper";

interface BookingPanelProps {
  room: MappedRoom;
  selectedRoomNumberId: string | null;
  selectedRoomNumberLabel: string | null;
  onRoomNumberSelect: (id: string | null, label: string | null) => void;
  errorMsg: string | null;
  isBookingInProgress: boolean;
  polling: boolean;
  bookingId: string | null;
  allRoomNumbers: any[];
  countdownLabel?: string | null;
  savePrefillForGuestForm?: (prefill: any) => void; // optional helper to save prefill to session storage
}

export default function BookingPanel({
  room,
  selectedRoomNumberId,
  selectedRoomNumberLabel,
  onRoomNumberSelect,
  errorMsg,
  isBookingInProgress,
  polling,
  bookingId,
  allRoomNumbers,
  countdownLabel,
  savePrefillForGuestForm,
}: BookingPanelProps) {
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

          {allRoomNumbers && allRoomNumbers.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-medium">Select room number (optional)</label>
              <select
                value={selectedRoomNumberId ?? ""}
                onChange={(e) => {
                  const val = e.target.value || null;
                  const sel = allRoomNumbers.find((rn: any) => String(rn._id ?? rn.id) === val);
                  const label = sel?.number ?? sel?._id ?? null;
                  onRoomNumberSelect(val, label);
                }}
                className="w-full mt-2 border rounded-lg px-3 py-2"
              >
                <option value="">Auto-assign (best available)</option>
                {allRoomNumbers.map((rn: any) => {
                  const label = rn.number ?? String(rn._id ?? rn.id ?? "");
                  return (
                    <option key={rn._id ?? rn.id ?? label} value={rn._id ?? rn.id ?? label}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <div className="text-xs text-gray-400 mt-1">
                If you choose a specific room number we will try to reserve it for you (availability validated on submit).
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex flex-row gap-3 items-center mb-2">
                <CalendarClock className="text-[#B1B5C3] w-5 h-5" /> Arrival date
              </div>
              <div className="text-xs text-gray-400">Add date in the booking form below</div>
            </div>

            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex flex-row gap-3 items-center mb-2">
                <CalendarClock className="text-[#B1B5C3] w-5 h-5" /> Departure date
              </div>
              <div className="text-xs text-gray-400">Add date in the booking form below</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex flex-row gap-3 items-center mb-2">
                <UserRoundCheck className="text-[#B1B5C3] w-5 h-5" /> Guests
              </div>
              <div className="text-xs text-gray-400">Add numbers in the booking form below</div>
            </div>
            <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
              <div className="flex flex-row gap-3 items-center mb-2">
                <SmileIcon className="text-[#B1B5C3] w-5 h-5" /> Rooms
              </div>
              <div className="text-xs text-gray-400">Add numbers in the booking form below</div>
            </div>
          </div>

          {errorMsg && <div className="mt-3 text-sm text-red-600">{errorMsg}</div>}

          <div className="mt-4">
            <Link href="#guest-form" className="w-full block text-center">
              <button
                onClick={() => {
                  // optional: save the selected roomNumber prefill for guest form
                  if (savePrefillForGuestForm) {
                    savePrefillForGuestForm({
                      roomId: room.id,
                      roomNumberId: selectedRoomNumberId,
                      roomNumber: selectedRoomNumberLabel,
                      totalPrice: room.price,
                    });
                  }
                }}
                className="w-full bg-[#b61e2e] text-white py-4 font-semibold"
              >
                BOOK NOW
              </button>
            </Link>
          </div>

          {isBookingInProgress && (
            <div className="mt-3 text-sm text-gray-600">Creating booking & initializing payment (please wait)...</div>
          )}

          {polling && bookingId && (
            <div className="mt-3 text-sm text-gray-600">
              Booking on hold — awaiting payment confirmation. We'll detect the result automatically.
              {countdownLabel && <div className="text-sm text-red-600 mt-1">Hold expires in {countdownLabel}</div>}
            </div>
          )}

          {!polling && countdownLabel && (
            <div className="mt-3 text-sm text-gray-600">Hold expires in {countdownLabel}</div>
          )}
        </div>
      </ScrollParallax>
    </div>
  );
}
