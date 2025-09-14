// types/booking.ts
export type BookingGuest = {
  adults: number;
  children: number;
};

export type BookingDoc = {
  _id: string;
  userId?: string;
  email: string;
  roomId: string;
  roomNumberId?: string;
  roomNumber?: string;
  checkIn: string; // ISO
  checkOut: string; // ISO
  guest: BookingGuest[];
  totalPrice: number;
  currency?: string;
  status?: "HOLD" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  paymentStatus?: string;
  holdExpiresAt?: string; // ISO string
  createdAt?: string;
  updatedAt?: string;
};
