// components/OfferCard.tsx
import React from "react";
import Image from "next/image";
import { BedIcon, WifiIcon, CoffeeIcon } from "./Icons";
import { UserRound } from "lucide-react";

export type Amenity = {
  key?: string;
  label: string;
};

export interface OfferCardProps {
  // legacy/compatible props - optional so old usages won't break
  offerType?: string;
  title: string;
  description?: string;
  price: string;

  // required/modern props
  src: string;

  // new/optional fields
  badge?: string; // e.g. "20% OFF"
  beds?: number | string; // number of beds or "2 Beds"
  amenities?: Amenity[]; // e.g. [{ label: "Free wifi" }, { label: "Breakfast included" }]
  oldPrice?: string; // struck-through price to show discount
  noOfPeople?: string | number; // kept for backward compatibility
  variant?: "default" | "compact" | "prominent";
  className?: string;
}

export default function OfferCard({
  offerType,
  title,
  description,
  price,
  src,
  badge,
  beds,
  amenities = [],
  oldPrice,
  noOfPeople,
  variant = "default",
  className = "",
}: OfferCardProps) {
  // Map amenity labels to icons where applicable
  const amenityIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("wifi"))
      return <WifiIcon className="w-4 h-4 text-gray-400" />;
    if (l.includes("breakfast") || l.includes("coffee"))
      return <CoffeeIcon className="w-4 h-4 text-gray-400" />;
    return null;
  };

  return (
    <article
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 ease-out hover:-translate-y-1 ${className}`}
      aria-label={title}
      tabIndex={0}
    >
      {/* IMAGE */}
      <div className="relative w-full h-60 md:h-72 lg:h-72 overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 48vw, 100vw"
          className="object-cover transform transition-transform duration-500 group-hover:scale-105"
        />

        {/* BADGE - top-left */}
        {badge && (
          <div className="absolute left-4 top-4 bg-black/85 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {badge}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="px-6 py-5">
        {offerType && <p className="text-sm text-gray-500 mb-2">{offerType}</p>}

        {/* TITLE + BEDS */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-gray-800">
            <UserRound className="w-4 h-4 text-gray-700 font-bold text-sm" />
            <div className="font-medium text-sm">
              {beds ?? noOfPeople ?? "-"}
            </div>
          </div>
        </div>

        {/* AMENITIES (small row) */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 items-center text-sm text-gray-500">
            {amenities.map((a, i) => (
              <div
                className="flex items-center gap-2"
                key={a.key ?? `${a.label}-${i}`}
              >
                <span className="flex items-center">
                  {amenityIcon(a.label)}
                </span>
                <span className="truncate">{a.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* optional description */}
        {description && (
          <p className="text-sm text-gray-600 mt-3">{description}</p>
        )}

        {/* PRICE ROW */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            {/* old price (light) */}
            {oldPrice && (
              <div className="inline-flex items-center border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-500 mb-2">
                <span className="line-through">{oldPrice}</span>
              </div>
            )}

            {/* price badge with hover highlight */}
            <div className="mt-1 inline-block rounded-md border border-gray-200 px-4 py-3 transition-shadow duration-300 group-hover:shadow-lg">
              <div className="text-red-700 font-extrabold text-xl transition-transform duration-300 group-hover:scale-105">
                {price}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">/Per night</div>
        </div>
      </div>
    </article>
  );
}
