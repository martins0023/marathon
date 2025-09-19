// components/GuestDetailsModal.tsx
"use client";

import React from "react";
import GuestDetailsForm from "./GuestDetailsForm";
import PaymentModal from "./PaymentModal";

interface GuestDetailsModalProps {
  open: boolean;
  onClose: () => void;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<{ bookingDoc?: any; paymentUrl?: string } | void>;
  isSubmitting?: boolean;
  paymentUrl?: string | null;
  paymentBookingId?: string | null;
}

export default function GuestDetailsModal({
  open,
  onClose,
  initialValues,
  onSubmit,
  paymentUrl,
  paymentBookingId,
}: GuestDetailsModalProps) {
  const [showPayment, setShowPayment] = React.useState<boolean>(false);
  const [paymentLink, setPaymentLink] = React.useState<string | null>(paymentUrl ?? null);
  const [bookingId, setBookingId] = React.useState<string | null>(paymentBookingId ?? null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setPaymentLink(paymentUrl ?? null);
  }, [paymentUrl]);

  React.useEffect(() => {
    setBookingId(paymentBookingId ?? null);
  }, [paymentBookingId]);

  // Called when GuestDetailsForm is submitted
  async function handleSubmit(values: any) {
    setSubmitting(true);
    try {
      const result = await onSubmit(values);
      // log full result for debugging
      // eslint-disable-next-line no-console
      console.debug("[GuestDetailsModal] onSubmit result:", result);

      if (!result) {
        // No result — show fallback error
        alert("Booking initialization failed. Please try again.");
        setSubmitting(false);
        return;
      }

      const pUrl = (result as any).paymentUrl ?? null;
      const bDoc = (result as any).bookingDoc ?? (result as any).bookingId ? (result as any).bookingDoc ?? { _id: (result as any).bookingId } : null;

      if (!pUrl && !bDoc) {
        // Unexpected shape — show error and print result in console
        // eslint-disable-next-line no-console
        console.error("[GuestDetailsModal] initialize returned no paymentUrl nor bookingDoc:", result);
        alert("Server returned unexpected response. Check console for details.");
        setSubmitting(false);
        return;
      }

      if (pUrl) {
        setPaymentLink(pUrl);
      }
      if (bDoc) {
        setBookingId(bDoc._id ?? null);
      }

      // show payment modal
      setShowPayment(true);

      // Optionally open payment in a new tab automatically (helpful)
      // Some browsers block popups if not triggered directly by user click; this call is still usually ok because it's inside click handler
      try {
        if (pUrl) {
          window.open(pUrl, "_blank", "noopener,noreferrer");
        }
      } catch (e) {
        // ignore popup-block errors
      }
    } catch (err: any) {
      // show friendly error
      // eslint-disable-next-line no-console
      console.error("[GuestDetailsModal] booking submission failed:", err);
      const msg = err?.message ?? "Booking submission failed. Try again.";
      // Simple user feedback: replace with your toast implementation if available
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-60 flex items-center pt-20 justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-70 w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-start mb-3">
              <div />
              <button className="text-gray-500" onClick={onClose}>✕</button>
            </div>
            <GuestDetailsForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              persistKey="guestDetails"
            />
          </div>
        </div>
      </div>

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        paymentUrl={paymentLink ?? null}
        bookingId={bookingId ?? null}
        countdown={undefined}
      />
    </>
  );
}
