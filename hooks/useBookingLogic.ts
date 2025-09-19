// hooks/useBookingLogic.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInitializeBooking, useBooking } from "./useBooking";
import { checkRoomAvailability, fetchBookingApi } from "../lib/bookings";
import type { InitializeBookingPayload } from "../lib/bookings";
import type { BookingDoc } from "../types/booking";
import type { MappedRoom } from "../lib/roomMapper";
import { parseIsoDate, formatCountdown } from "../utils/bookingHelpers";

/**
 * Keys & events used for cross-component communication
 */
const SESSION_KEY_CURRENT_HOLD = "booking:current_hold";
const SESSION_KEY_DATES = "booking:dates"; // { arrivalDate, departureDate }
const SESSION_KEY_PREFILL = "booking:guest_prefill";
const DATES_EVENT = "booking:dates:update";

export function useBookingLogic(room?: MappedRoom | null) {
  const [selectedRoomNumberId, setSelectedRoomNumberId] = useState<string | null>(null);
  const [selectedRoomNumberLabel, setSelectedRoomNumberLabel] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [allRoomNumbers, setAllRoomNumbers] = useState<any[]>([]);
  const [availableRoomNumbers, setAvailableRoomNumbers] = useState<any[] | null>(null); // null = not checked yet
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [countdownLabel, setCountdownLabel] = useState<string | null>(null);

  const initBooking = useInitializeBooking();

  // Provide current booking polling query (react-query wrapper)
  const bookingQuery = useBooking(bookingId, { enabled: !!bookingId, refetchInterval: polling ? 3000 : undefined });

  // populate allRoomNumbers from rawRoom if available
  useEffect(() => {
    if (!room?.rawRoom) {
      setAllRoomNumbers([]);
      return;
    }
    const rn = Array.isArray(room.rawRoom.room_numbers) ? room.rawRoom.room_numbers : [];
    setAllRoomNumbers(rn);
  }, [room]);

  // resume hold from session storage if same room
  useEffect(() => {
    if (!room) return;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY_CURRENT_HOLD);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.roomId === room.id && parsed.bookingId) {
        setBookingId(parsed.bookingId);
        setPolling(true);
        const d = parsed.holdExpiresAt ? new Date(parsed.holdExpiresAt) : null;
        setHoldExpiresAt(d);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [room]);

  // when bookingQuery updates, clear session on CONFIRMED/CANCELLED/EXPIRED
  useEffect(() => {
    const b = bookingQuery.data as BookingDoc | null | undefined;
    if (!b) return;
    if (b.status === "CONFIRMED") {
      setPolling(false);
      setHoldExpiresAt(null);
      setCountdownLabel(null);
      try {
        sessionStorage.removeItem(SESSION_KEY_CURRENT_HOLD);
      } catch {}
    } else if (b.status === "CANCELLED" || b.status === "EXPIRED") {
      setPolling(false);
      setHoldExpiresAt(null);
      setCountdownLabel(null);
      try {
        sessionStorage.removeItem(SESSION_KEY_CURRENT_HOLD);
      } catch {}
    } else {
      // if still HOLD, update holdExpiresAt if present
      const d = b.holdExpiresAt ? parseIsoDate(b.holdExpiresAt) : null;
      if (d) setHoldExpiresAt(d);
    }
  }, [bookingQuery.data]);

  // countdown for holdExpiresAt
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
        setPolling(false);
        setBookingId(null);
        try {
          sessionStorage.removeItem(SESSION_KEY_CURRENT_HOLD);
        } catch {}
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        return;
      }
      setCountdownLabel(formatCountdown(ms));
    }

    if (holdExpiresAt) {
      tick();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = window.setInterval(tick, 1000);
      return () => {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      };
    } else {
      setCountdownLabel(null);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    }
  }, [holdExpiresAt]);

  // read dates from session storage
  function readDatesFromSession() {
    try {
      const s = sessionStorage.getItem(SESSION_KEY_DATES);
      if (!s) return null;
      return JSON.parse(s) as { arrivalDate?: string; departureDate?: string } | null;
    } catch {
      return null;
    }
  }

  // listen for custom event when dates are updated
  useEffect(() => {
    async function onDatesEvent() {
      const dates = readDatesFromSession();
      if (!dates || !dates.arrivalDate || !dates.departureDate) {
        // clear availability if incomplete
        setAvailableRoomNumbers(null);
        return;
      }
      // check availability from server
      await refreshAvailability(dates.arrivalDate, dates.departureDate);
    }

    window.addEventListener(DATES_EVENT, onDatesEvent);
    // also run once on mount if dates exist
    onDatesEvent();

    return () => {
      window.removeEventListener(DATES_EVENT, onDatesEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, allRoomNumbers]);

  // compute available room numbers by calling backend check
  async function refreshAvailability(arrivalDate?: string | null, departureDate?: string | null) {
    if (!room?.rawRoom || !room.rawRoom._id) {
      setAvailableRoomNumbers(null);
      return [];
    }
    if (!arrivalDate || !departureDate) {
      setAvailableRoomNumbers(null);
      return [];
    }
    try {
      const overlaps = await checkRoomAvailability(String(room.rawRoom._id), arrivalDate, departureDate); // returns bookings overlapping
      // get set of roomNumberId or roomNumber that are already booked
      const bookedSet = new Set<string>();
      for (const b of overlaps) {
        if (b.roomNumberId) bookedSet.add(String(b.roomNumberId));
        else if (b.roomNumber) bookedSet.add(String(b.roomNumber));
      }
      // available are those in room.rawRoom.room_numbers that are not in bookedSet
      const allRns = Array.isArray(room.rawRoom.room_numbers) ? room.rawRoom.room_numbers : [];
      const available = allRns.filter((rn: any) => {
        const id = String(rn._id ?? rn.id ?? rn.number ?? "");
        return !bookedSet.has(id);
      });
      setAvailableRoomNumbers(available);
      return available;
    } catch (err) {
      // if error, we set availableRoomNumbers to [] (none available) to prevent selection
      setAvailableRoomNumbers([]);
      return [];
    }
  }

  // mutate/init booking: validate guest counts and call initialize endpoint
  async function handleBookingSubmit(payload: InitializeBookingPayload) {
    setErrorMsg(null);
    if (!room || !room.rawRoom) {
      setErrorMsg("Room data not available.");
      throw new Error("Room data missing");
    }

    try {
      const result = await initBooking.mutateAsync(payload);
      if (!result || !result.details) {
        setErrorMsg("Booking initialization failed.");
        throw new Error("No booking details");
      }

      const bookingDoc = result.details.room_details as BookingDoc;
      const paymentUrl = result.details.payment_url as string;

      // Store hold info in session storage
      try {
        sessionStorage.setItem(
          SESSION_KEY_CURRENT_HOLD,
          JSON.stringify({
            bookingId: bookingDoc._id,
            roomId: room.rawRoom._id,
            holdExpiresAt: bookingDoc.holdExpiresAt ?? bookingDoc.createdAt ?? null,
            payment_url: paymentUrl,
          })
        );
      } catch {}

      // start polling and update holdExpiresAt
      setBookingId(bookingDoc._id);
      setPolling(true);
      const d = parseIsoDate(bookingDoc.holdExpiresAt ?? bookingDoc.createdAt ?? null);
      if (d) setHoldExpiresAt(d);

      return { bookingDoc, paymentUrl };
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to initialize booking");
      throw err;
    }
  }

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

  function savePrefillForGuestForm(prefill: any) {
    try {
      sessionStorage.setItem(SESSION_KEY_PREFILL, JSON.stringify(prefill ?? {}));
    } catch {}
  }

  function readPrefillForGuestForm() {
    try {
      const s = sessionStorage.getItem(SESSION_KEY_PREFILL);
      if (!s) return null;
      return JSON.parse(s);
    } catch {
      return null;
    }
  }

  // Expose simple helper to externally refresh availability (e.g. call from page)
  async function refreshAvailabilityForDates(arrival?: string | null, departure?: string | null) {
    return refreshAvailability(arrival ?? undefined, departure ?? undefined);
  }

  return {
    selectedRoomNumberId,
    selectedRoomNumberLabel,
    errorMsg,
    bookingId,
    polling,
    initBooking,
    allRoomNumbers,
    availableRoomNumbers,
    handleRoomNumberSelect,
    handleBookingSubmit,
    clearHold,
    countdownLabel,
    savePrefillForGuestForm,
    readPrefillForGuestForm,
    refreshAvailabilityForDates,
    isBookingInProgress: initBooking.isPending,
  };
}