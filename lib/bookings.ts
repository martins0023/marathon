// lib/bookings.ts
import { apiFetch } from "./apiClient";
import type { BookingDoc } from "../types/booking";

export type InitializeBookingPayload = {
  email: string;
  roomId: string;
  roomNumberId?: string | null;
  roomNumber?: string | null;
  checkIn: string; // ISO string
  checkOut: string; // ISO string
  guest: { adults: number; children: number }[]; // backend expects array
  totalPrice: number;
};

export type InitializeBookingResponse = {
  success: boolean;
  details: {
    payment_url: string;
    room_details: BookingDoc;
  };
};

export async function initializeBookingApi(
  payload: InitializeBookingPayload
): Promise<InitializeBookingResponse> {
  const res = await apiFetch<InitializeBookingResponse>("/api/booking/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res;
}

export async function fetchBookingApi(bookingId: string): Promise<{ success: boolean; details: BookingDoc | null }> {
  if (!bookingId) throw new Error("Missing bookingId");
  const res = await apiFetch<{ success: boolean; details: BookingDoc | null }>(`/api/booking/fetch/${encodeURIComponent(bookingId)}`);
  return res;
}

/**
 * Check availability (find bookings overlapping the given dates for the room).
 * Uses the existing `POST /api/booking/fetch` endpoint which supports
 * filtering by roomId, checkIn and checkOut.
 *
 * Returns array of booking docs that overlap (booked/hold) the date range.
 */
export async function checkRoomAvailability(roomId: string, checkIn: string, checkOut: string) {
  if (!roomId || !checkIn || !checkOut) return [];
  const body = {
    roomId,
    checkIn,
    checkOut,
  };
  // backend route expects JSON body
  const res = await apiFetch<{ success: boolean; details: any[] }>("/api/booking/fetch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res?.details ?? [];
}
