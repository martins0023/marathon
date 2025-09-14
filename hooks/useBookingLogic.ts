// hooks/useBookingLogic.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInitializeBooking, useBooking } from "./useBooking";
import type { InitializeBookingPayload } from "../lib/bookings";
import type { BookingDoc } from "../types/booking";
import type { MappedRoom } from "../lib/roomMapper"; // your room mapping type
import { parseIsoDate, formatCountdown } from "../utils/bookingHelpers";
import { fetchBookingApi } from "../lib/bookings";

/**
 * sessionStorage key(s)
 */
const SESSION_KEY_CURRENT_HOLD = "booking:current_hold";
const SESSION_KEY_PREFILL = "booking:guest_prefill";

/**
 * useBookingLogic
 * - orchestrates initializeBooking, polling, hold countdown, and room-number selection
 */
export function useBookingLogic(room?: MappedRoom | null) {
  // room: mapped presentation shape (room.rawRoom should exist if you used my mapper)
  const [selectedRoomNumberId, setSelectedRoomNumberId] = useState<string | null>(null);
  const [selectedRoomNumberLabel, setSelectedRoomNumberLabel] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [allRoomNumbers, setAllRoomNumbers] = useState<any[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);

  // init booking mutation
  const initBooking = useInitializeBooking();

  // resume any hold in sessionStorage for this room
  useEffect(() => {
    if (!room) return;
    // set available room numbers from rawRoom if present
    const rn = (room.rawRoom && Array.isArray(room.rawRoom.room_numbers)) ? room.rawRoom.room_numbers : [];
    setAllRoomNumbers(rn);

    try {
      const raw = sessionStorage.getItem(SESSION_KEY_CURRENT_HOLD);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        bookingId?: string;
        roomId?: string;
        holdExpiresAt?: string;
        payment_url?: string;
      };
      if (parsed && parsed.roomId === room.id) {
        if (parsed.bookingId) {
          setBookingId(parsed.bookingId);
          setPolling(true);
          const d = parsed.holdExpiresAt ? new Date(parsed.holdExpiresAt) : null;
          setHoldExpiresAt(d);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [room]);

  // polling for booking status using useBooking hook
  const bookingQuery = useBooking(bookingId, { enabled: !!bookingId, refetchInterval: polling ? 3000 : undefined });

  // when bookingQuery data updates check status and clear when confirmed
  useEffect(() => {
    const b = bookingQuery.data as BookingDoc | null | undefined;
    if (!b) return;
    if (b.status === "CONFIRMED") {
      // booking confirmed — stop polling and clear hold storage
      setPolling(false);
      setCountdownLabel(null);
      try {
        sessionStorage.removeItem(SESSION_KEY_CURRENT_HOLD);
      } catch {}
    }
    // if status moved to cancelled/expired -> clear
    if (b.status === "CANCELLED" || b.status === "EXPIRED") {
      setPolling(false);
      setCountdownLabel(null);
      try {
        sessionStorage.removeItem(SESSION_KEY_CURRENT_HOLD);
      } catch {}
    }
  }, [bookingQuery.data]);

  // countdown timer for holdExpiresAt
  const countdownTimerRef = useRef<number | null>(null);
  useEffect(() => {
    function tick() {
      if (!holdExpiresAt) {
        setCountdownLabel(null);
        return;
      }
      const ms = holdExpiresAt.getTime() - Date.now();
      if (ms <= 0) {
        setCountdownLabel("00:00");
        // hold expired: clear hold and stop polling
        setPolling(false);
        setBookingId(null);
        try {
          sessionStorage.removeItem(SESSION_KEY_CURRENT_HOLD);
        } catch {}
        if (countdownTimerRef.current) {
          window.clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        return;
      }
      setCountdownLabel(formatCountdown(ms));
    }

    if (holdExpiresAt) {
      tick();
      if (countdownTimerRef.current) window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = window.setInterval(tick, 1000);
      return () => {
        if (countdownTimerRef.current) window.clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      };
    } else {
      setCountdownLabel(null);
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    }
  }, [holdExpiresAt]);

  // helper to pick a numeric price (min) from the room
  const unitMinPrice = useMemo(() => {
    if (!room?.rawRoom || !Array.isArray(room.rawRoom.price)) return 0;
    const arr = room.rawRoom.price.map((p: any) => Number(p)).filter((n: number) => Number.isFinite(n));
    return arr.length ? Math.min(...arr) : 0;
  }, [room]);

  // method to start initialization — the hook caller (guest form) will call handleBookingSubmit(payload)
  async function handleBookingSubmit(formValues: any) {
    setErrorMsg(null);

    if (!room || !room.rawRoom) {
      setErrorMsg("Room data not available.");
      throw new Error("Room data missing");
    }

    // Validate guests against room.max_people (if available)
    const maxPeople = Number(room.rawRoom.max_people ?? 0);
    const guestsTotal = Number(formValues.guests ?? 0);
    if (maxPeople > 0 && guestsTotal > maxPeople) {
      setErrorMsg(`Selected guests (${guestsTotal}) exceeds room max of ${maxPeople}`);
      throw new Error("Guest count exceeds max allowed");
    }

    // Build payload expected by backend
    const payload: InitializeBookingPayload = {
      email: String(formValues.email ?? ""),
      roomId: String(room.rawRoom._id),
      roomNumberId: selectedRoomNumberId ?? undefined,
      roomNumber: selectedRoomNumberLabel ?? undefined,
      checkIn: String(formValues.arrivalDate),
      checkOut: String(formValues.departureDate),
      guest: Array.isArray(formValues.guest)
        ? formValues.guest
        : [
            {
              adults: Number(formValues.adults ?? Math.max(1, Math.floor(guestsTotal))),
              children: Number(formValues.children ?? 0),
            },
          ],
      totalPrice: Number(formValues.totalPrice ?? (unitMinPrice * (Number(formValues.rooms ?? 1) || 1))),
    };

    try {
      // Start mutation
      const result = await initBooking.mutateAsync(payload);
      if (!result || !result.details) {
        setErrorMsg("Booking initialization failed.");
        throw new Error("No booking details");
      }

      const bookingDoc = result.details.room_details as BookingDoc;
      const paymentUrl = result.details.payment_url as string;

      // Save hold info to session storage so refresh/paging survives
      try {
        const saveObj = {
          bookingId: bookingDoc._id,
          roomId: room.rawRoom._id,
          holdExpiresAt: bookingDoc.holdExpiresAt ?? bookingDoc.createdAt ?? null,
          payment_url: paymentUrl,
        };
        sessionStorage.setItem(SESSION_KEY_CURRENT_HOLD, JSON.stringify(saveObj));
      } catch (e) {
        // ignore session storage failures
      }

      // set local states and start polling
      setBookingId(bookingDoc._id);
      setPolling(true);

      // compute holdExpiresAt date if provided
      const d = parseIsoDate(bookingDoc.holdExpiresAt ?? bookingDoc.createdAt ?? null);
      if (d) setHoldExpiresAt(d);

      // return server response so caller can open payment modal or redirect
      return { bookingDoc, paymentUrl };
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to initialize booking");
      throw err;
    }
  }

  // select room number
  function handleRoomNumberSelect(id: string | null, label: string | null) {
    setSelectedRoomNumberId(id);
    setSelectedRoomNumberLabel(label);
  }

  function clearHold() {
    try {
      sessionStorage.removeItem(SESSION_KEY_CURRENT_HOLD);
    } catch {}
    setBookingId(null);
    setPolling(false);
    setHoldExpiresAt(null);
    setCountdownLabel(null);
  }

  // allow exposing initialized booking doc via fetch if desired
  async function fetchLatestBooking(bookingIdArg?: string) {
    try {
      const id = bookingIdArg ?? bookingId;
      if (!id) return null;
      const res = await fetchBookingApi(id);
      return res?.details ?? null;
    } catch (e) {
      return null;
    }
  }

  // prefill hook helpers for guest form: if booking panel "BOOK NOW" prefilled the form,
  // the guest form can read sessionStorage key SESSION_KEY_PREFILL to prefill fields.
  function savePrefillForGuestForm(prefill: any) {
    try {
      sessionStorage.setItem("booking:guest_prefill", JSON.stringify(prefill ?? {}));
    } catch {}
  }

  function readPrefillForGuestForm() {
    try {
      const s = sessionStorage.getItem("booking:guest_prefill");
      if (!s) return null;
      return JSON.parse(s);
    } catch {
      return null;
    }
  }

  const isBookingInProgress = initBooking.status === "pending" || polling;

  return {
    selectedRoomNumberId,
    selectedRoomNumberLabel,
    errorMsg,
    bookingId,
    polling,
    initBooking,
    allRoomNumbers,
    handleRoomNumberSelect,
    handleBookingSubmit,
    clearHold,
    countdownLabel,
    savePrefillForGuestForm,
    readPrefillForGuestForm,
    fetchLatestBooking,
    isBookingInProgress,
  };
}
