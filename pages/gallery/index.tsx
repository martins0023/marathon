// pages/gallery/index.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollFade, ScrollStagger } from "../../components/animations";
import FeatureCard from "../../components/FeatureCard";
import QualityCTA from "../../components/QualityCTA";
import { OFFERS, ROOMS } from "../../data/offers";

/**
 * Gallery page
 *
 * - Responsive gallery grid (mobile → 2 cols, sm → 3, md → 4)
 * - Category filters and simple "load more" pagination
 * - Click image to open lightbox modal with prev/next and thumbnail strip
 * - Re-uses existing UI components / animations to match app feel
 *
 * Drop this file at: pages/gallery/index.tsx
 */

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: "room" | "dining" | "meeting" | "other";
};

const INITIAL_VISIBLE = 12;

export default function GalleryPage() {
  // Build gallery items by pulling images from ROOMS and OFFERS and adding some placeholders
  const galleryItems: GalleryItem[] = useMemo(() => {
    const items: GalleryItem[] = [];

    // from ROOMS (detailed images)
    for (const r of ROOMS) {
      r.images.forEach((img, i) =>
        items.push({
          id: `room-${r.slug}-${i}`,
          src: img,
          alt: `${r.title} ${i + 1}`,
          category: r.slug.includes("dining") ? "dining" : r.slug.includes("meetings") ? "meeting" : "room",
        })
      );
    }

    // from OFFERS (cover images)
    for (const o of OFFERS) {
      items.push({
        id: `offer-${o.slug}`,
        src: o.src,
        alt: o.title,
        category: o.offerType?.toLowerCase().includes("din") ? "dining" : "room",
      });
    }

    // small set of extra images (fallback placeholders)
    const extras = [
      { src: "/images/honeymoon.png", alt: "Lobby" },
      { src: "/images/conferences.png", alt: "Pool" },
      { src: "/images/dining-3.png", alt: "Restaurant" },
    ];
    extras.forEach((e, i) =>
      items.push({
        id: `extra-${i}`,
        src: e.src,
        alt: e.alt,
        category: i === 2 ? "dining" : "other",
      })
    );

    return items;
  }, []);

  const [filter, setFilter] = useState<"all" | "room" | "dining" | "meeting" | "other">("all");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  // modal state
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const filtered = useMemo(() => {
    return galleryItems.filter((g) => (filter === "all" ? true : g.category === filter));
  }, [galleryItems, filter]);

  const visibleItems = filtered.slice(0, visible);

  useEffect(() => {
    // reset visible when filter changes
    setVisible(INITIAL_VISIBLE);
  }, [filter]);

  const openAt = (indexInFiltered: number) => {
    setActiveIndex(indexInFiltered);
    setIsOpen(true);
  };

  const next = () => setActiveIndex((i) => (i + 1) % filtered.length);
  const prev = () => setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);

  return (
    <main className="min-h-screen bg-white font-inter">
      <div className="pt-28" />

      {/* HERO */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <ScrollFade>
            <div>
              <p className="text-sm text-primary font-medium mb-3">Gallery</p>
              <h1 className="text-3xl sm:text-4xl font-orelega">A glimpse of Marathon</h1>
              <p className="mt-4 text-gray-600 max-w-xl">
                Explore photos of our rooms, dining and meeting spaces. Click any image to view it larger.
              </p>

              <div className="mt-6 flex gap-3">
                <Link href="/rooms" className="inline-block px-6 py-3 bg-primary text-white font-semibold hover:bg-[#a4182b] transition-colors">
                  Browse rooms
                </Link>
                <Link href="/contact" className="inline-block px-6 py-3 border border-gray-200 hover:bg-gray-50 transition-colors">
                  Contact us
                </Link>
              </div>
            </div>
          </ScrollFade>

          <ScrollFade>
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/meetings-1.jpg" alt="Gallery hero" fill className="object-cover" />
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            {(["all", "room", "dining", "meeting", "other"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-2 rounded-md text-sm ${filter === c ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
              >
                {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            Showing <strong>{visibleItems.length}</strong> of <strong>{filtered.length}</strong> images
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-6 py-8">
        <ScrollFade className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleItems.map((g, idx) => {
            // compute index in filtered array for modal navigation
            const indexInFiltered = filtered.findIndex((f) => f.id === g.id);
            return (
              <ScrollFade key={g.id} offsetY={18} start={0.12 + idx * 0.01} end={0.5}>
                <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                  <button
                    onClick={() => openAt(indexInFiltered)}
                    className="block w-full h-full"
                    aria-label={`Open ${g.alt}`}
                  >
                    <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]">
                      <Image src={g.src} alt={g.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="absolute left-3 bottom-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      {g.category === "room" ? "Room" : g.category === "dining" ? "Dining" : g.category === "meeting" ? "Meeting" : "Other"}
                    </div>
                  </button>
                </div>
              </ScrollFade>
            );
          })}
        </ScrollFade>

        {/* load more */}
        <div className="mt-6 text-center">
          {visible < filtered.length ? (
            <button
              onClick={() => setVisible((v) => Math.min(filtered.length, v + 12))}
              className="px-6 py-3 rounded-md bg-white border border-gray-200"
            >
              Load more
            </button>
          ) : filtered.length > INITIAL_VISIBLE ? (
            <button onClick={() => setVisible(INITIAL_VISIBLE)} className="px-6 py-3 rounded-md bg-white border border-gray-200">
              Show less
            </button>
          ) : null}
        </div>
      </section>

      {/* Small feature section */}
      <section className="container mx-auto px-6 py-12">
        <h3 className="text-xl font-semibold mb-4">Curated spaces</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard title="Elegant Rooms" src="/images/room1-1.png" />
          <FeatureCard title="Relaxing Pool" src="/images/room1-2.png" />
          <FeatureCard title="Fine Dining" src="/images/room1-3.png" />
        </div>
      </section>

      <QualityCTA />

      {/* Lightbox modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div className="absolute inset-0 bg-black/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              className="relative z-60 w-full max-w-5xl mx-4 sm:mx-8"
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-lg overflow-hidden">
                {/* main image */}
                <div className="relative w-full h-[60vh] sm:h-[72vh] bg-black/10">
                  <Image
                    src={filtered[activeIndex]?.src ?? filtered[0]?.src}
                    alt={filtered[activeIndex]?.alt ?? "Image"}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* controls */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="bg-black/40 text-white p-2 rounded-full"
                  >
                    ‹
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="bg-black/40 text-white p-2 rounded-full"
                  >
                    ›
                  </button>
                </div>

                {/* thumbnail strip */}
                <div className="bg-white/95 py-3 px-4 overflow-x-auto flex gap-3 items-center">
                  {filtered.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveIndex(i)}
                      className={`flex-shrink-0 rounded-md overflow-hidden ${i === activeIndex ? "ring-2 ring-primary/50" : ""}`}
                      style={{ minWidth: 84 }}
                    >
                      <div className="relative w-[84px] h-20">
                        <Image src={f.src} alt={f.alt} fill className="object-cover" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* footer */}
                <div className="p-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">{filtered[activeIndex]?.alt}</div>
                  <button onClick={() => setIsOpen(false)} className="text-sm text-gray-500">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
