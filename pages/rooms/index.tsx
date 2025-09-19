// pages/rooms/index.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import OfferCard from "../../components/OfferCard";
import FeatureCard from "../../components/FeatureCard";
import QualityCTA from "../../components/QualityCTA";
import GuestDetailsForm from "../../components/GuestDetailsForm";
import { ScrollFade, ScrollStagger } from "../../components/animations";
import { useRooms } from "../../hooks/useRooms";
import { Room } from "../../lib/types";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader } from "../../components/Loader";

/**
 * Rooms Listing / Booking page (backend-driven)
 *
 * - Uses useRooms() to fetch real rooms from your backend (/api/room)
 * - Maps backend Room model to the OfferCard props used in your UI
 *
 * NOTES:
 * - If you already have a global QueryClientProvider in _app.tsx,
 *   remove the local provider below and export the inner component directly.
 */

// create a query client for local provider (memoize in module scope)
const queryClient = new QueryClient();

function mapRoomToOffer(room: Room) {
  const numericPrices: number[] = Array.isArray(room.price)
    ? room.price
        .map((p) => {
          // room.price should be numbers; if strings appear, try to coerce
          if (typeof p === "number") return p;
          const n = Number(p);
          return Number.isFinite(n) ? n : NaN;
        })
        .filter((n) => Number.isFinite(n))
    : [];

  // pick the min (current) price for display
  const minPrice = numericPrices.length
    ? Math.min(...numericPrices)
    : undefined;
  const maxPrice = numericPrices.length
    ? Math.max(...numericPrices)
    : undefined;

  const priceFormatted =
    minPrice !== undefined ? `₦${Number(minPrice).toLocaleString()}` : "₦0";

  const imageSrc =
    room.images && room.images.length
      ? room.images[0].url
      : "/images/bedroom.png";

  return {
    slug: room._id,
    offerType: room.room_type ?? "Room",
    title: room.title,
    description: room.desc ?? "",
    price: priceFormatted,
    priceNumbers: numericPrices, // <-- pass full numeric array for badge calc
    src: imageSrc,
    noOfPeople: String(room.max_people ?? ""),
    oldPrice: maxPrice ? `₦${Number(maxPrice).toLocaleString()}` : undefined,
    badge: undefined,
    beds: undefined,
  };
}

export default function RoomsContent() {
  const { data: rooms, isLoading, isError, error } = useRooms();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  // map backend rooms to display data
  const mapped = useMemo(() => {
    if (!rooms) return [];
    return rooms.map(mapRoomToOffer);
  }, [rooms]);

  // derive list based on filters / search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mapped.filter((o) => {
      if (
        filterType &&
        o.offerType &&
        o.offerType.toLowerCase() !== filterType.toLowerCase()
      )
        return false;
      if (!q) return true;
      return (
        (o.title && o.title.toLowerCase().includes(q)) ||
        (o.description && o.description.toLowerCase().includes(q)) ||
        (o.slug && o.slug.toLowerCase().includes(q))
      );
    });
  }, [mapped, query, filterType]);

  const selectedOffer = useMemo(
    () => mapped.find((o) => o.slug === selectedSlug) ?? null,
    [mapped, selectedSlug]
  );

  return (
    <main className="min-h-screen bg-white font-inter">
      {/* offset for fixed navbar */}
      <div className="pt-28" />

      {/* HERO / Search */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <ScrollFade>
              <p className="text-sm text-primary font-medium mb-2">Rooms</p>
              <h1 className="text-3xl sm:text-4xl font-orelega">
                Find your perfect stay
              </h1>
              <p className="mt-3 text-gray-600 max-w-2xl">
                Browse our rooms and packages. Click any card to view full
                details, or book directly from the list.
              </p>

              <div className="mt-6 flex gap-3 items-center">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">
                    Search rooms
                  </label>
                  <input
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, type, or keyword"
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="hidden sm:flex gap-2">
                  <button
                    onClick={() => {
                      setFilterType(null);
                    }}
                    className={`px-3 py-2 rounded-md border ${
                      filterType === null ? "bg-primary text-white" : ""
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType("room")}
                    className={`px-3 py-2 rounded-md border ${
                      filterType === "room" ? "bg-primary text-white" : ""
                    }`}
                  >
                    Rooms
                  </button>
                  <button
                    onClick={() => setFilterType("dining")}
                    className={`px-3 py-2 rounded-md border ${
                      filterType === "dining" ? "bg-primary text-white" : ""
                    }`}
                  >
                    Dining
                  </button>
                </div>
              </div>
            </ScrollFade>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="relative w-56 h-40 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/bedroom.png"
                alt="Rooms hero"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main grid: Listings (left) + Sticky booking (right) */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Available offers</h2>
                <div className="text-sm text-gray-500">
                  {isLoading ? (
                    <Loader message="Loading results" />
                  ) : (
                    `${filtered.length} results`
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={""}
                  onChange={() => {}}
                  className="rounded-md border-gray-200 px-3 py-2 text-sm hidden sm:block"
                >
                  <option>Sort: Recommended</option>
                  <option>Price: Low to high</option>
                  <option>Price: High to low</option>
                </select>
              </div>
            </div>

            {/* Loading / Error handling */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 animate-pulse h-56"
                  />
                ))}
              </div>
            )}

            {isError && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-lg p-4">
                <strong>Error:</strong>{" "}
                {(error as any)?.message ?? "Failed to load rooms."}
              </div>
            )}

            {!isLoading && !isError && (
              <ScrollFade className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filtered.map((offer, idx) => (
                  <ScrollFade
                    key={offer.slug}
                    offsetY={18}
                    start={0.12 + idx * 0.01}
                    end={0.5}
                    delay={idx * 0.02}
                  >
                    <div className="bg-transparent">
                      <div className="rounded-2xl overflow-hidden group">
                        <Link
                          href={`/rooms/${offer.slug}`}
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                          className="block"
                        >
                          <OfferCard
                            offerType={offer.offerType ?? "Room"}
                            title={offer.title}
                            description={offer.description}
                            price={offer.price}
                            src={offer.src}
                            priceNumbers={offer.priceNumbers} // <-- pass the numeric array so badge can be computed
                            noOfPeople={offer.noOfPeople ?? ""}
                            oldPrice={offer.oldPrice}
                            badge={offer.badge}
                          />
                        </Link>

                        {/* actions below card */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {offer.noOfPeople
                              ? `${offer.noOfPeople} people`
                              : ""}
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/rooms/${offer.slug}`}
                              onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }
                              className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedSlug(offer.slug);
                                const el = document.getElementById(
                                  "booking-form-anchor"
                                );
                                if (el)
                                  el.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                              }}
                              className="text-sm px-3 py-2 rounded-md bg-primary text-white hover:bg-[#a4182b]"
                            >
                              Book now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollFade>
                ))}
              </ScrollFade>
            )}
          </div>

          {/* Sticky sidebar booking card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold">Booking</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Select an offer to pre-fill the booking form.
                </p>

                <div className="mt-4">
                  {selectedOffer ? (
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-16 relative rounded-lg overflow-hidden">
                        <Image
                          src={selectedOffer.src}
                          alt={selectedOffer.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">
                          {selectedOffer.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedOffer.price}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No selection yet — click "Book now" on any offer.
                    </div>
                  )}
                </div>

                <div id="booking-form-anchor" className="mt-4">
                  <button
                    onClick={() => {
                      // reveal the form area below by selecting first offer when none selected
                      if (!selectedOffer && mapped.length > 0)
                        setSelectedSlug(mapped[0].slug);
                      const el = document.getElementById("booking-form-anchor");
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }}
                    className="w-full px-4 py-3 rounded-md bg-[#b61e2e] text-white font-semibold hover:bg-[#cf2732]"
                  >
                    Continue to booking
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Prices shown are per night. Taxes and fees may apply at
                  checkout.
                </div>
              </div>

              {/* small contact card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="text-sm font-medium">Need help?</div>
                <div className="mt-2 text-sm text-gray-500">
                  Call our support line for immediate assistance.
                </div>
                <a
                  href="tel:+2348123456789"
                  className="mt-3 inline-block text-sm text-primary underline"
                >
                  +234 812 345 6789
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Booking form area (full width under listings on mobile; visible alongside on larger screens) */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* <div className="lg:col-span-2">
              <GuestDetailsForm
                initialValues={
                  selectedOffer
                    ? {
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        country: "NG",
                        arrivalDate: "",
                        departureDate: "",
                        guests: Number(selectedOffer.noOfPeople) || 1,
                        rooms: 1,
                        specialRequests: "",
                      }
                    : {}
                }
                persistKey="guestDetails"
                redirectTo="/checkout"
                onSubmit={(vals) => {
                  // small client-side handling example
                  console.log(
                    "Booking prepared for:",
                    selectedOffer?.slug ?? "no-selection",
                    vals
                  );
                }}
              />
            </div> */}

            <aside className="lg:col-span-1">
              <div className="bg-white border rounded-xl p-4">
                <h4 className="font-semibold">Booking summary</h4>
                <div className="mt-3">
                  <div className="text-sm text-gray-500">Selected offer</div>
                  <div className="mt-2">
                    {selectedOffer ? (
                      <>
                        <div className="font-medium">{selectedOffer.title}</div>
                        <div className="text-sm text-gray-500">
                          {selectedOffer.price}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No offer selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href="/rooms"
                    className="text-sm text-primary underline"
                  >
                    View all offers
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Feature / Info */}
      <section className="container mx-auto px-6 py-12">
        <h3 className="text-xl font-semibold mb-4">Why choose Marathon</h3>
        <ScrollFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard title="24/7 Support" src="/images/room1-3.png" />
          <FeatureCard title="Free breakfast" src="/images/dining.png" />
          <FeatureCard title="Central locations" src="/images/dining-1.jpg" />
          <FeatureCard title="Easy booking" src="/images/conferences.png" />
        </ScrollFade>
      </section>

      {/* Quality CTA */}
      <QualityCTA />
    </main>
  );
}

/**
 * Page wrapper:
 * - we wrap the content in QueryClientProvider so hooks work even if your app doesn't have a global provider yet.
 * - If you already added a QueryClientProvider in _app.tsx, you can export RoomsContent directly:
 *   export default RoomsContent;
 */
// export default function RoomsPageWrapper() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <RoomsContent />
//     </QueryClientProvider>
//   );
// }
