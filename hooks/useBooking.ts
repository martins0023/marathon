// hooks/useBooking.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initializeBookingApi, fetchBookingApi, InitializeBookingPayload } from "../lib/bookings";
import type { BookingDoc } from "../types/booking";

/**
 * useInitializeBooking - mutation wrapper
 */
export function useInitializeBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InitializeBookingPayload) => initializeBookingApi(payload),
    onSuccess: () => {
      // optionally invalidate lists, rooms, etc. after booking confirmed
      // qc.invalidateQueries(["rooms"]); // optionally
    },
  });
}

/**
 * useBooking - poll a booking by id (refetchInterval used for polling)
 * If refetchInterval is number > 0 then it will poll that millisecond interval
 */
export function useBooking(bookingId?: string | null, opts?: { enabled?: boolean; refetchInterval?: number }) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const data = await fetchBookingApi(bookingId);
      return data?.details ?? null;
    },
    enabled: !!bookingId && (opts?.enabled ?? true),
    refetchInterval: opts?.refetchInterval ?? false,
    staleTime: 1000 * 5,
    retry: 1,
  });
}
