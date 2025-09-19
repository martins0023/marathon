// components/RelatedRooms.tsx
"use client";

import React from "react";
import Link from "next/link";
import OfferCard from "./OfferCard";
import { ScrollFade } from "./animations";

interface RelatedRoom {
  slug: string;
  title: string;
  description: string;
  price: string;
  src: string;
  noOfPeople: string;
  oldPrice?: string;
}

interface RelatedRoomsProps {
  rooms: RelatedRoom[];
}

export default function RelatedRooms({ rooms }: RelatedRoomsProps) {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <div className="mt-40">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">You might also like</h3>
          <p className="text-gray-500">Other rooms & packages you may enjoy</p>
        </div>
        <Link href="/apartments" className="text-primary font-semibold">View all</Link>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((r, idx) => (
          <ScrollFade key={r.slug} offsetY={18} start={0.18 + idx * 0.02} end={0.5 + idx * 0.02} delay={0.03 * idx}>
            <Link href={`/rooms/${r.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="block">
              <OfferCard
                offerType="Room"
                title={r.title}
                description={r.description}
                price={r.price}
                src={r.src}
                noOfPeople={r.noOfPeople}
                oldPrice={r.oldPrice}
              />
            </Link>
          </ScrollFade>
        ))}
      </div>
    </div>
  );
}