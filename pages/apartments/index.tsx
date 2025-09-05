// pages/apartments/index.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollFade, ScrollStagger } from "../../components/animations";
import FeatureCard from "../../components/FeatureCard";
import OfferCard from "../../components/OfferCard";
import GuestDetailsForm from "../../components/GuestDetailsForm";
import QualityCTA from "../../components/QualityCTA";
import { OFFERS } from "../../data/offers";

/**
 * Apartments listing page
 * - Follows the same UI language, spacing and responsiveness as other pages
 * - Driven by OFFERS data (data/offers.ts)
 * - Left side: apartment cards grid
 * - Right side: sticky booking panel + quick filters
 * - Booking form below (mobile-first stacked)
 *
 * Drop this file in pages/apartments/index.tsx
 */

export default function ApartmentsPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [filterBeds, setFilterBeds] = useState<number | null>(null);

  // derive filtered offers (apartments only: we treat offerType === "Room" | "Apartment")
  const apartments = useMemo(() => {
    // For this app we treat all OFFERS as possible apartments; filter by query/beds/price
    return OFFERS.map((o) => ({
      ...o,
      // normalize price numeric by removing non-digits (best-effort)
      _priceNum: Number(String(o.price).replace(/[^\d]/g, "")) || 0,
      _beds: o.beds ?? (typeof o.noOfPeople === "number" ? Number(o.noOfPeople) : undefined) ?? 1,
    }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apartments.filter((a) => {
      if (q && !(`${a.title} ${a.description} ${a.offerType} ${a.slug}`.toLowerCase().includes(q))) return false;
      if (minPrice !== "" && a._priceNum < Number(minPrice)) return false;
      if (maxPrice !== "" && a._priceNum > Number(maxPrice)) return false;
      if (filterBeds !== null && a._beds !== undefined && a._beds < filterBeds) return false;
      return true;
    });
  }, [apartments, query, minPrice, maxPrice, filterBeds]);

  const selectedOffer = useMemo(() => OFFERS.find((o) => o.slug === selectedSlug) ?? null, [selectedSlug]);

  return (
    <main className="min-h-screen bg-white font-inter">
      <div className="pt-28" />

      {/* HERO */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <ScrollFade>
              <p className="text-sm text-primary font-medium mb-2">Apartments</p>
              <h1 className="text-3xl sm:text-4xl font-orelega">Comfortable apartments for short & long stays</h1>
              <p className="mt-3 text-gray-600 max-w-2xl">
                Browse our apartments designed for business travellers and families — spacious layouts, kitchenettes and longer-stay amenities.
              </p>

              <div className="mt-6 flex gap-3">
                <Link href="/rooms" className="inline-block px-6 py-3 bg-primary text-white font-semibold hover:bg-[#a4182b] transition-colors">
                  View rooms
                </Link>
                <Link href="/contact" className="inline-block px-6 py-3 border border-gray-200 hover:bg-gray-50 transition-colors">
                  Contact us
                </Link>
              </div>
            </ScrollFade>
          </div>

          <div className="hidden lg:block">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/hero-3.jpg" alt="Apartments hero" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">Search apartments</label>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, feature or keyword"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={filterBeds ?? ""}
              onChange={(e) => setFilterBeds(e.target.value ? Number(e.target.value) : null)}
              className="rounded-md border-gray-200 px-3 py-2"
            >
              <option value="">Any beds</option>
              <option value="1">1+ beds</option>
              <option value="2">2+ beds</option>
              <option value="3">3+ beds</option>
            </select>

            <button
              onClick={() => {
                setQuery("");
                setMinPrice("");
                setMaxPrice("");
                setFilterBeds(null);
              }}
              className="px-3 py-2 rounded-md border text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={minPrice === "" ? "" : String(minPrice)}
            onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Min price (₦)"
            className="border rounded-md px-3 py-2"
            type="number"
            min={0}
          />
          <input
            value={maxPrice === "" ? "" : String(maxPrice)}
            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Max price (₦)"
            className="border rounded-md px-3 py-2"
            type="number"
            min={0}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <select className="rounded-md border-gray-200 px-3 py-2 text-sm">
              <option>Recommended</option>
              <option>Price low → high</option>
              <option>Price high → low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Available apartments</h2>
                <p className="text-sm text-gray-500">{filtered.length} results</p>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <button onClick={() => {}} className="px-3 py-2 rounded-md border text-sm">Map view</button>
                <button onClick={() => {}} className="px-3 py-2 rounded-md border text-sm">List view</button>
              </div>
            </div>

            <ScrollFade className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {filtered.map((apt, idx) => (
                <ScrollFade key={apt.slug} offsetY={18} start={0.12 + idx * 0.01} end={0.5}>
                  <div className="bg-transparent">
                    <div className="rounded-2xl overflow-hidden group">
                      <Link href={`/rooms/${apt.slug}`} className="block">
                        <OfferCard
                          offerType={apt.offerType ?? "Apartment"}
                          title={apt.title}
                          description={apt.description}
                          price={apt.price}
                          src={apt.src}
                          noOfPeople={apt.noOfPeople ?? ""}
                          oldPrice={apt.oldPrice}
                          badge={apt.badge}
                          beds={apt.beds}
                        />
                      </Link>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {apt.beds ? `${apt.beds} beds` : apt.noOfPeople ? `${apt.noOfPeople} people` : ""}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/rooms/${apt.slug}`} className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50">
                            View
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedSlug(apt.slug);
                              const el = document.getElementById("apartments-booking-form");
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                            }}
                            className="text-sm px-3 py-2 rounded-md bg-primary text-white hover:bg-[#a4182b]"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollFade>
              ))}
            </ScrollFade>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold">Quick booking</h4>
                <p className="text-sm text-gray-500 mt-1">Select an apartment to pre-fill the booking form.</p>

                <div className="mt-4">
                  {selectedOffer ? (
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-16 relative rounded-lg overflow-hidden">
                        <Image src={selectedOffer.src} alt={selectedOffer.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{selectedOffer.title}</div>
                        <div className="text-sm text-gray-500">{selectedOffer.price}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No apartment selected yet — choose one to continue</div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      if (!selectedOffer && OFFERS.length > 0) setSelectedSlug(OFFERS[0].slug);
                      const el = document.getElementById("apartments-booking-form");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="w-full px-4 py-3 rounded-md bg-[#b61e2e] text-white font-semibold hover:bg-[#cf2732]"
                  >
                    Continue to booking
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Prices may change during high demand. Check final price on checkout.
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h5 className="font-medium">Need assistance?</h5>
                <p className="text-sm text-gray-500 mt-2">Contact our reservations team for group rates and long-stay discounts.</p>
                <a href="mailto:contact@marathon.example" className="mt-3 inline-block text-sm text-primary underline">Email reservations</a>
              </div>
            </div>
          </aside>
        </div>

        {/* Booking form */}
        <div className="pt-20"></div>
        <GuestDetailsForm />
      </section>

      {/* Why choose apartments */}
      <section className="container mx-auto px-6 py-12">
        <h3 className="text-xl font-semibold mb-4">Apartment benefits</h3>
        <ScrollFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard title="Kitchenette" src="/images/dining-2.jpg" />
          <FeatureCard title="Workspace" src="/images/meetings-3.jpg" />
          <FeatureCard title="Washer & dryer" src="/images/services.png" />
          <FeatureCard title="Long-stay rates" src="/images/romantic-dining.png" />
        </ScrollFade>
      </section>

      <QualityCTA />
    </main>
  );
}
