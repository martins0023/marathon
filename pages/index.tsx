// pages/index.tsx
"use client";

import React from "react";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import OfferCard from "../components/OfferCard";
import Image from "next/image";
import QualityCTA from "../components/QualityCTA";
import { ScrollFade } from "../components/animations";
import Link from "next/link";

import { useRooms } from "../hooks/useRooms";
import { getTopDroppedOffers } from "../lib/mappers";

export default function Home() {
  const { data: rooms, isLoading, isError } = useRooms();

  // compute top 3 offers by price-drop percent (min vs max)
  const topSpecialOffers = React.useMemo(() => {
    if (!rooms) return [];
    return getTopDroppedOffers(rooms, 3);
  }, [rooms]);

  return (
    <div>
      <Hero />

      {/* Our Rooms Section */}
      <section id="rooms" className="container mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollFade>
            <div className="lg:pr-10 justify-items-center">
              <p className="section-title">OUR ROOMS</p>
              <div className="h-10 border-l border-black mt-1 mb-1" />
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 font-orelega text-center">
                Comfort & Style For All.
              </h2>
              <p className="mt-4 text-gray-600">
                We offer comfortable stays for business and leisure — handpicked rooms and packages to suit your needs.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <button className="px-16 py-4 bg-primary text-white shadow-md hover:bg-red-700 transition-colors">
                  Book Now
                </button>
                <button className="px-6 py-3 underline uppercase font-semibold border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  View All
                </button>
              </div>
            </div>
          </ScrollFade>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="relative aspect-[16/14]">
              <Image src="/images/bedroom.png" alt="room" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-12 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-6 items-start">
          <div className="md:row-span-2">
            <FeatureCard title="Rooms" src="/images/room.png" large />
          </div>

          <div>
            <FeatureCard title="Dining" src="/images/dining.png" />
          </div>

          <div>
            <FeatureCard title="Conferences & Meetings" src="/images/conferences.png" />
          </div>

          <div>
            <FeatureCard title="Service & Facilities" src="/images/services.png" />
          </div>

          <div>
            <FeatureCard title="Wedding Package" src="/images/wedding.png" />
          </div>
        </div>
      </section>

      {/* Best Offer of the Month Section */}
      <section className="container mt-20">
        <ScrollFade offsetY={14} start={0.08} end={0.36}>
          <h3 className="mb-2 text-primary font-medium text-xl font-inter">Special Offer</h3>
        </ScrollFade>

        <div className="flex items-center justify-between">
          <ScrollFade offsetY={22} start={0.12} end={0.44} delay={0}>
            <h3 id="special-offers-heading" className="text-2xl font-bold font-orelega">
              Best offer of the month
            </h3>
          </ScrollFade>

          <ScrollFade offsetY={18} start={0.14} end={0.48} delay={0.05}>
            <a className="text-md text-primary hidden sm:flex font-bold hover:underline cursor-pointer" href="/rooms">
              View all
            </a>
          </ScrollFade>
        </div>

        <ScrollFade offsetY={18} start={0.18} end={0.5} delay={0.06}>
          <p className="mt-3 text-gray-500 max-w-md">
            Experience fantastic benefits and obtain better rates when you make a direct booking on our official website.
          </p>
        </ScrollFade>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading placeholders */}
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-56" />
            ))}

          {/* Error fallback */}
          {isError && (
            <div className="col-span-3 bg-red-50 border border-red-100 text-red-700 rounded-lg p-4">
              Could not load special offers from server.
            </div>
          )}

          {/* Render top offers when available */}
          {!isLoading && !isError && topSpecialOffers.length > 0 && (
            <>
              {topSpecialOffers.map((offer, idx) => (
                <ScrollFade
                  key={offer.slug}
                  offsetY={18}
                  start={0.18 + idx * 0.02}
                  end={0.5 + idx * 0.02}
                  delay={0.06 + idx * 0.02}
                >
                  <Link
                    href={`/rooms/${offer.slug}`}
                    onClick={() => {
                      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="block"
                  >
                    <OfferCard
                      offerType={offer.offerType}
                      title={offer.title}
                      noOfPeople={offer.noOfPeople}
                      description={offer.description}
                      price={offer.price}
                      priceNumbers={offer.priceNumbers}
                      src={offer.src}
                      oldPrice={offer.oldPrice}
                      badge={offer.badge}
                      beds={offer.beds}
                      amenities={offer.amenities as any}
                    />
                  </Link>
                </ScrollFade>
              ))}
            </>
          )}

          {/* nothing available */}
          {!isLoading && !isError && topSpecialOffers.length === 0 && (
            <div className="col-span-3 text-center text-gray-500">No special offers available right now.</div>
          )}
        </div>
      </section>

      {/* Our Apartments Section */}
      <section className="container mt-40">
        <ScrollFade offsetY={14} start={0.08} end={0.36}>
          <p className="mb-2 text-primary font-medium text-xl font-inter">Just for you</p>
        </ScrollFade>
        <ScrollFade offsetY={22} start={0.12} end={0.44} delay={0}>
          <h3 className="text-3xl font-bold mt-2 font-orelega">Our Apartments</h3>
        </ScrollFade>
        <ScrollFade offsetY={18} start={0.18} end={0.5} delay={0.06}>
          <p className="text-gray-500 mt-2">Experience fantastic benefits and obtain better rates when you make a direct booking on our official website.</p>
        </ScrollFade>

        <div className="mt-8 max-w-[1400px] mx-auto ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollFade offsetY={18} start={0.14} end={0.48} delay={0.05}>
              <OfferCard title="Honeymoon" price="₦200,000" oldPrice="₦250,000" src="/images/bedroom.png" badge="20% OFF" beds={2} amenities={[{ label: "Free wifi" }, { label: "Breakfast included" }]} />
            </ScrollFade>

            <ScrollFade offsetY={18} start={0.14} end={0.48} delay={0.05}>
              <OfferCard title="Honeymoon" price="₦200,000" oldPrice="₦250,000" src="/images/bedroom3.png" badge="20% OFF" beds={2} amenities={[{ label: "Free wifi" }, { label: "Breakfast included" }]} />
            </ScrollFade>

            <ScrollFade offsetY={18} start={0.14} end={0.48} delay={0.05}>
              <OfferCard title="Honeymoon" price="₦200,000" oldPrice="₦250,000" src="/images/bed2.png" beds={1} amenities={[{ label: "Free wifi" }, { label: "Breakfast included" }]} />
            </ScrollFade>
          </div>
        </div>

        <div className="mt-8 text-center text-primary">
          <button className="px-32 py-5 border border-primary uppercase font-semibold text-xs hover:bg-gradient-to-l from-orange-100 to-red-200 transition-colors">View All</button>
        </div>
      </section>

      <QualityCTA />
    </div>
  );
}
