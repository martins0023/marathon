// pages/rooms/[slug].tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import OfferCard from "../../components/OfferCard";
import { ScrollFade } from "../../components/animations";
import ScrollParallax from "../../components/ScrollParallax";
import { ROOMS } from "../../data/offers";
import {
  Calendar,
  CalendarClock,
  ImageIcon,
  SmileIcon,
  UserRoundCheck,
} from "lucide-react";
import QualityCTA from "../../components/QualityCTA";
import GuestDetailsForm, { GuestDetailsValues } from "../../components/GuestDetailsForm";

type RoomType = (typeof ROOMS)[number];

export default function RoomDetails() {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const room = useMemo(
    () => ROOMS.find((r) => r.slug === slug) ?? ROOMS[0],
    [slug]
  );

  // gallery state
  const [activeIndex, setActiveIndex] = useState(0);

  // modal/lightbox
  const [showGallery, setShowGallery] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    // keep modalIndex in sync with activeIndex when opening
    if (showGallery) setModalIndex(activeIndex);
  }, [showGallery, activeIndex]);

  useEffect(() => {
    // lock body scroll while modal open
    if (typeof window === "undefined") return;
    if (showGallery) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showGallery]);

  // handle thumbnail click on main page
  const showImage = (i: number) => {
    setActiveIndex(i);
  };

  function onGuestSubmit(values: GuestDetailsValues) {
  // handle booking state (send to API, redirect, etc.)
  console.log("guest submitted:", values);
  // example: router.push('/checkout') or api call
}

  // modal navigation
  const nextModal = () => setModalIndex((i) => (i + 1) % room.images.length);
  const prevModal = () =>
    setModalIndex((i) => (i - 1 + room.images.length) % room.images.length);

  // build relatedRooms (prefer explicit related list, else fallback)
  const relatedRooms = useMemo(() => {
    const related: RoomType[] = [];
    if (room.related && room.related.length > 0) {
      for (const s of room.related) {
        const r = ROOMS.find((x) => x.slug === s);
        if (r && r.slug !== room.slug) related.push(r);
      }
    }
    if (related.length === 0) {
      for (const r of ROOMS) {
        if (r.slug !== room.slug) related.push(r);
        if (related.length >= 3) break;
      }
    }
    return related;
  }, [room]);

  return (
    <main className="min-h-screen bg-white font-inter pt-28">
      {/* NOTE: pt-28 ensures content starts below your fixed navbar.
          Adjust if your navbar height differs. */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Top grid: left images, right details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* LEFT: Image gallery (spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Main image */}
              <div className="flex-1 rounded-2xl overflow-hidden">
                <ScrollFade offsetY={24} start={0.08} end={0.4}>
                  <motion.div
                    key={room.images[activeIndex]}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                  >
                    <div className="relative w-full h-[54vh] md:h-[60vh] lg:h-[72vh] rounded-2xl overflow-hidden">
                      <Image
                        src={room.images[activeIndex]}
                        alt={`${room.title} image`}
                        fill
                        sizes="(min-width:1024px) 60vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                </ScrollFade>
              </div>

              {/* Thumbnails column */}
              <div className="w-full md:w-[140px]">
                <div
                  className={`flex gap-4 md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0`}
                  // hide scrollbar in a tasteful way
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {room.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => {
                        showImage(i);
                        // on mobile, bring thumbnail into view (optional)
                        // Using element scrollIntoView might jump; leaving UX simple
                      }}
                      className={`relative rounded-xl overflow-hidden flex-shrink-0 ${
                        // mobile: fixed thumbnail width; desktop: full width in column
                        "min-w-[84px] md:min-w-full"
                      } border ${
                        i === activeIndex
                          ? "border-primary"
                          : "border-transparent"
                      } focus:outline-none`}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <div className="relative w-[84px] h-20 md:w-full md:h-24 lg:h-28">
                        <Image
                          src={img}
                          alt={`thumb ${i}`}
                          fill
                          className="object-cover"
                        />
                        <div
                          className={`absolute inset-0 ${
                            i === activeIndex
                              ? "ring-2 ring-primary/40"
                              : "bg-black/0"
                          } transition-all`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* "Show all photos" CTA below images for mobile */}
            <div className="mt-4 md:hidden">
              <button
                onClick={() => {
                  setModalIndex(activeIndex);
                  setShowGallery(true);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow text-sm"
                aria-label="Show all photos"
              >
                {/* simple camera icon */}
                <svg
                  className="w-4 h-4 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 7h4l2-3h6l2 3h4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Show all photos
              </button>
            </div>
          </div>

          {/* RIGHT: Details & booking card */}
          <aside className="lg:col-span-1">
            <div className="space-y-6">
              <ScrollFade offsetY={18} start={0.1} end={0.45}>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-orelega">
                    {room.title}
                  </h1>
                  <p className="mt-2 text-gray-600">{room.short}</p>
                </div>
              </ScrollFade>

              <ScrollFade offsetY={20} start={0.14} end={0.5}>
                <div className="text-gray-700">{room.description}</div>
              </ScrollFade>

              <ScrollFade offsetY={20} start={0.16} end={0.54}>
                <div>
                  <h4 className="font-semibold mt-4 mb-3">Amenities</h4>
                  <ul className="space-y-3 text-gray-600">
                    {room.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M3 12h18"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollFade>

              {/* Sticky booking card */}
              <div className="mt-6">
                <div className="sticky top-24">
                  <ScrollParallax amount={6} className="relative">
                    <div className="bg-[#F4F5F6] rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">Price</div>
                          <div className="text-xl font-bold text-red-700">
                            {room.price}
                          </div>
                          {room.oldPrice && (
                            <div className="text-sm line-through text-gray-400">
                              {room.oldPrice}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {room.beds ? `${room.beds} Beds` : ""}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
                          <div className="flex flex-row gap-3 items-center mb-2">
                            <CalendarClock className="text-[#B1B5C3] w-5 h-5" />{" "}
                            Arrival date
                          </div>
                          <div className="text-xs text-gray-400">Add date</div>
                        </div>

                        <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
                          <div className="flex flex-row gap-3 items-center mb-2">
                            <CalendarClock className="text-[#B1B5C3] w-5 h-5" />
                            Departure date{" "}
                          </div>
                          <div className="text-xs text-gray-400">Add date</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
                          <div className="flex flex-row gap-3 items-center mb-2">
                            <UserRoundCheck className="text-[#B1B5C3] w-5 h-5" />
                            Guests{" "}
                          </div>
                          <div className="text-xs text-gray-400">
                            Add numbers
                          </div>
                        </div>
                        <div className="border rounded-md px-3 py-3 text-sm text-gray-900">
                          <div className="flex flex-row gap-3 items-center mb-2">
                            <SmileIcon className="text-[#B1B5C3] w-5 h-5" />
                            Rooms{" "}
                          </div>
                          <div className="text-xs text-gray-400">
                            Add numbers
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button className="w-full bg-[#b61e2e] text-white py-4 font-semibold">
                          BOOK NOW
                        </button>
                      </div>
                    </div>
                  </ScrollParallax>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* RELATED OFFERS */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">You might also like</h3>
              <p className="text-gray-500">
                Other rooms & packages you may enjoy
              </p>
            </div>
            <Link href="/apartments" className="text-primary font-semibold">
              View all
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedRooms.map((r, idx) => (
              <ScrollFade
                key={r.slug}
                offsetY={18}
                start={0.18 + idx * 0.02}
                end={0.5 + idx * 0.02}
                delay={0.03 * idx}
              >
                <Link
                  href={`/rooms/${r.slug}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="block"
                >
                  <OfferCard
                    offerType="Room"
                    title={r.title}
                    description={r.short}
                    price={r.price}
                    src={r.images[0]}
                    noOfPeople={r.beds ?? 0}
                    oldPrice={r.oldPrice}
                  />
                </Link>
              </ScrollFade>
            ))}
          </div>
        </div>

        {/* GUEST DETAILS FORM */}
        <GuestDetailsForm
  initialValues={{ email: "user@example.com" }}
  onSubmit={onGuestSubmit}
  persistKey="guestDetails"
/>
      </div>

      {/* Gallery Modal / Lightbox */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setShowGallery(false)}
          >
            {/* dark backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            />

            {/* content container - stopPropagation to prevent closing when clicking inside */}
            <motion.div
              className="relative z-70 w-full max-w-4xl mx-4 md:mx-8 lg:mx-0 rounded-lg overflow-hidden"
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* main modal image */}
              <div className="relative w-full h-[56vh] md:h-[72vh] bg-black/5">
                <Image
                  src={room.images[modalIndex]}
                  alt={`modal ${modalIndex + 1}`}
                  fill
                  className="object-contain bg-black"
                  sizes="(min-width:1024px) 800px, 100vw"
                />
              </div>

              {/* left/right nav */}
              <button
                onClick={prevModal}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-80 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <button
                onClick={nextModal}
                aria-label="Next image"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-80 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {/* thumbnails inside modal */}
              <div className="bg-white/95 py-3 px-4 flex items-center gap-3 overflow-x-auto">
                {room.images.map((img, i) => (
                  <button
                    key={`modal-thumb-${img}-${i}`}
                    onClick={() => setModalIndex(i)}
                    className={`flex-shrink-0 rounded-md overflow-hidden ${i === modalIndex ? "ring-2 ring-primary/50" : ""}`}
                    style={{ minWidth: 84 }}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <div className="relative w-[84px] h-20">
                      <Image src={img} alt={`modal thumb ${i}`} fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>

              {/* close button */}
              <button
                onClick={() => setShowGallery(false)}
                aria-label="Close gallery"
                className="absolute top-3 right-3 z-90 bg-white/90 p-2 rounded-full"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <QualityCTA />
    </main>
  );
}
