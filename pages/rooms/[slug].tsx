// pages/rooms/[slug].tsx (Main File)
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useRoom, useRooms as useRoomsList } from "../../hooks/useRooms";
import { safeImageSrc } from "../../lib/imageUtils";

// Components
import RoomGallery from "../../components/RoomGallery";
import RoomDetails from "../../components/RoomDetails";
import BookingPanel from "../../components/BookingPanel";
import RelatedRooms from "../../components/RelatedRooms";
import GuestDetailsForm from "../../components/GuestDetailsForm";
import QualityCTA from "../../components/QualityCTA";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

// Utils and Hooks
import { mapRoomForDetails } from "../../lib/roomMapper";
import { mapRelatedRooms } from "../../utils/relatedRoomsMapper";
import { useBookingLogic } from "../../hooks/useBookingLogic";

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
    handleRoomNumberSelect,
    handleBookingSubmit,
  } = useBookingLogic(room);

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
              />
            </div>
          </aside>
        </div>

        {/* Related rooms */}
        <RelatedRooms rooms={relatedRooms} />

        {/* Guest details form */}
        <div id="guest-form" className="mt-10">
          <GuestDetailsForm
            initialValues={{ email: "" }}
            onSubmit={async (values) => {
              await handleBookingSubmit(values);
            }}
            persistKey="guestDetails"
          />
        </div>
      </div>

      <QualityCTA />
    </main>
  );
}