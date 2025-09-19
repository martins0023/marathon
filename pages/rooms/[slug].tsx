// pages/rooms/[slug].tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useRoom, useRooms as useRoomsList } from "../../hooks/useRooms";
import { safeImageSrc } from "../../lib/imageUtils";

// Components
import RoomGallery from "../../components/RoomGallery";
import RoomDetails from "../../components/RoomDetails";
import BookingPanel from "../../components/BookingPanel";
import RelatedRooms from "../../components/RelatedRooms";
import QualityCTA from "../../components/QualityCTA";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import GuestDetailsModal from "../../components/GuestDetailsModal";

// Utils and Hooks
import { mapRoomForDetails } from "../../lib/roomMapper";
import { mapRelatedRooms } from "../../utils/relatedRoomsMapper";
import { useBookingLogic } from "../../hooks/useBookingLogic";
import { parsePrice } from "../../utils/priceUtils";
import { InitializeBookingPayload } from "../../lib/bookings"; // Import the payload type

export default function RoomDetailsPage() {
  const router = useRouter();
  const slugRaw = router.query?.slug;
  const slug = Array.isArray(slugRaw) ? slugRaw[0] : slugRaw ?? null;

  // Fetch single room
  const { data: roomData, isLoading: isRoomLoading, isError: isRoomError, error: roomError } = useRoom(slug ?? undefined);

  // Fetch all rooms for related list
  const { data: allRooms } = useRoomsList();

  // Map room data
  const room = useMemo(() => mapRoomForDetails(roomData ?? undefined), [roomData]);

  // Map related rooms
  const relatedRooms = useMemo(() => mapRelatedRooms(allRooms, roomData ?? undefined), [allRooms, roomData]);

  // Booking logic hook
  const {
    selectedRoomNumberId,
    selectedRoomNumberLabel,
    errorMsg,
    bookingId,
    polling,
    initBooking,
    allRoomNumbers,
    availableRoomNumbers,
    handleRoomNumberSelect,
    handleBookingSubmit: handleBookingLogicSubmit,
    countdownLabel,
    savePrefillForGuestForm,
    readPrefillForGuestForm,
  } = useBookingLogic(room);

  // State to manage modal visibility and initial values
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestPrefill, setGuestPrefill] = useState<Record<string, any> | null>(null);

  // Calculate total price and save prefill before opening the modal
  function openGuestModalWithPrefill() {
    const prefill = readPrefillForGuestForm();
    if (prefill && room.rawRoom) {
      const pricePerRoom = parsePrice(room.price);
      const totalPrice = pricePerRoom * (prefill.rooms || 1);
      const fullPrefill = {
        ...prefill,
        totalPrice,
        roomId: room.rawRoom._id,
        roomNumberId: selectedRoomNumberId,
        roomNumber: selectedRoomNumberLabel,
      };
      setGuestPrefill(fullPrefill);
    }
    setGuestModalOpen(true);
  }

  // This function is passed to the GuestDetailsForm and handles the booking process
  const onGuestFormSubmit = async (formValues: any) => {
    // Construct the payload to match the backend endpoint
    const payload: InitializeBookingPayload = {
      email: formValues.email,
      roomId: formValues.roomId,
      roomNumberId: formValues.roomNumberId,
      roomNumber: formValues.roomNumber,
      checkIn: formValues.arrivalDate,
      checkOut: formValues.departureDate,
      guest: [{
        adults: formValues.guests,
        children: 0, // Assuming children is always 0 for now based on the form
      }],
      totalPrice: formValues.totalPrice,
    };

    try {
      const { paymentUrl } = await handleBookingLogicSubmit(payload);
      if (paymentUrl) {
        window.location.href = paymentUrl; // Redirect to payment page
      }
    } catch (err) {
      console.error("Booking submission failed:", err);
      // The error state is already handled by useBookingLogic hook
    }
  };

  // Handle images
  const images = room.images && room.images.length ? room.images : [safeImageSrc(null)];

  // Loading and error states
  if (isRoomLoading) {
    return <LoadingState />;
  }

  if (isRoomError) {
    return <ErrorState error={roomError} />;
  }

  return (
    <main className="min-h-screen bg-white font-inter pt-28">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* LEFT: Image gallery */}
          <div className="lg:col-span-2">
            <RoomGallery images={images} title={room.title} />
          </div>

          {/* RIGHT: Details & booking */}
          <aside className="lg:col-span-1">
            <RoomDetails room={room} />

            {/* Booking panel */}
            <div className="mt-6">
              <BookingPanel
                room={room}
                selectedRoomNumberId={selectedRoomNumberId}
                selectedRoomNumberLabel={selectedRoomNumberLabel}
                onRoomNumberSelect={handleRoomNumberSelect}
                errorMsg={errorMsg}
                isBookingInProgress={initBooking.isPending}
                polling={polling}
                bookingId={bookingId}
                allRoomNumbers={allRoomNumbers}
                availableRoomNumbers={availableRoomNumbers}
                countdownLabel={countdownLabel}
                savePrefillForGuestForm={savePrefillForGuestForm}
                openGuestModal={openGuestModalWithPrefill}
              />
            </div>
          </aside>
        </div>

        {/* Related rooms */}
        <RelatedRooms rooms={relatedRooms} />

      </div>

      <QualityCTA />

      {/* Guest Details Modal */}
      <GuestDetailsModal
        open={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        initialValues={guestPrefill || {}}
        onSubmit={onGuestFormSubmit}
        paymentUrl={undefined}
        paymentBookingId={undefined}
      />
    </main>
  );
}