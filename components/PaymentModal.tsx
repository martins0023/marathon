// components/PaymentModal.tsx
"use client";

import React from "react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  paymentUrl: string | null;
  countdown?: string | null;
  bookingId?: string | null;
}

export default function PaymentModal({ open, onClose, paymentUrl, countdown, bookingId }: PaymentModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-90 w-full max-w-lg mx-4 bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold">Complete payment</h3>
          <p className="mt-2 text-gray-600">You will be redirected to the secure payment page to confirm and pay for your booking.</p>

          {bookingId && <div className="mt-3 text-sm text-gray-500">Booking ID: <code>{bookingId}</code></div>}
          {countdown && <div className="mt-2 text-sm text-red-600">Hold expires in {countdown}</div>}

          <div className="mt-6 flex gap-3">
            <a href={paymentUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="flex-1 inline-block text-center px-4 py-3 bg-[#b61e2e] text-white rounded-lg font-semibold">
              Proceed to payment
            </a>
            <button onClick={onClose} className="px-4 py-3 rounded-lg border">Close</button>
          </div>

          <div className="mt-4 text-xs text-gray-400">Opening in a new tab lets us continue to poll for payment status automatically.</div>
        </div>
      </div>
    </div>
  );
}
