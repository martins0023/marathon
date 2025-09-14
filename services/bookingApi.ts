// services/bookingApi.ts
import { GuestDetailsValues } from "../types/guestForm";

export interface BookingResponse {
  success: boolean;
  bookingId: string;
}

export async function mockBookingApi(payload: GuestDetailsValues): Promise<BookingResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  // Simulate random failure (10%)
  if (Math.random() < 0.1) {
    const error: any = new Error("Network error - please try again");
    error.status = 502;
    throw error;
  }
  
  return { 
    success: true, 
    bookingId: `MOCK-${Math.floor(Math.random() * 1000000)}` 
  };
}