// components/OfferCard.tsx
import React from "react";
import Image from "next/image";
import { BedIcon, WifiIcon, CoffeeIcon } from "./Icons";
import { AirVent, UserRound } from "lucide-react";
import { safeImageSrc } from "../lib/imageUtils";

export type Amenity = {
  key?: string;
  label: string;
};

export interface OfferCardProps {
  // legacy/compatible props - optional so old usages won't break
  offerType?: string;
  title: string;
  description?: string;
  price?: string; // display string (kept for backwards compatibility)

  // required/modern props
  src: string;

  // modern: backend price array (preferred)
  priceNumbers?: number[]; // maps to backend `price: [Number]`

  // new/optional fields
  badge?: string; // explicit badge override (e.g. "20% OFF")
  beds?: number | string; // number of beds or "2 Beds"
  amenities?: Amenity[]; // e.g. [{ label: "Free wifi" }, { label: "Breakfast included" }]
  oldPrice?: string; // optional old price string (if backend provides or you derive)
  noOfPeople?: string | number; // kept for backward compatibility
  variant?: "default" | "compact" | "prominent";
  className?: string;
}

/** small helper to parse currency-like strings into numbers */
function parseCurrencyToNumber(s?: string | null): number | null {
  if (!s) return null;
  const cleaned = String(s).replace(/[^\d.-]+/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Compute badge text and display price / old price strings.
 * Priority:
 * 1. If explicit `badge` prop provided => use as override.
 * 2. Else if `priceNumbers` present => use min as current, max as old (if different) and compute percent.
 * 3. Else if `price` and `oldPrice` strings parseable => compute percent.
 * 4. Fallback to using provided `price` / `oldPrice` strings as-is.
 */
function computeBadgeAndDisplay({
  badge,
  priceNumbers,
  price,
  oldPrice,
}: {
  badge?: string | undefined;
  priceNumbers?: number[] | undefined;
  price?: string | undefined;
  oldPrice?: string | undefined;
}) {
  // badge override
  if (badge) {
    return {
      badgeText: badge,
      displayPrice: price ?? undefined,
      displayOldPrice: oldPrice ?? undefined,
    };
  }

  // priceNumbers preferred
  if (Array.isArray(priceNumbers) && priceNumbers.length > 0) {
    const nums = priceNumbers.filter((n) => typeof n === "number" && Number.isFinite(n));
    if (nums.length > 0) {
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const displayPrice = `₦${Number(min).toLocaleString()}`;

      if (max > min) {
        const percent = Math.round(((max - min) / max) * 100);
        const badgeText = `${percent}% OFF`;
        const displayOldPrice = `₦${Number(max).toLocaleString()}`;
        return { badgeText, displayPrice, displayOldPrice };
      }

      return { badgeText: undefined, displayPrice, displayOldPrice: undefined };
    }
  }

  // fallback to parsing price & oldPrice strings (if both exist)
  const priceNum = parseCurrencyToNumber(price ?? null);
  const oldNum = parseCurrencyToNumber(oldPrice ?? null);
  if (priceNum !== null && oldNum !== null && oldNum > priceNum) {
    const percent = Math.round(((oldNum - priceNum) / oldNum) * 100);
    return {
      badgeText: `${percent}% OFF`,
      displayPrice: `₦${Number(priceNum).toLocaleString()}`,
      displayOldPrice: `₦${Number(oldNum).toLocaleString()}`,
    };
  }

  // final fallback: use provided strings
  return {
    badgeText: undefined,
    displayPrice: price ?? undefined,
    displayOldPrice: oldPrice ?? undefined,
  };
}

export default function OfferCard({
  offerType,
  title,
  description,
  price,
  src,
  priceNumbers,
  badge,
  beds,
  amenities = [],
  oldPrice,
  noOfPeople,
  variant = "default",
  className = "",
}: OfferCardProps) {
  // amenity -> icon mapping
  const amenityIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("wifi")) return <WifiIcon className="w-4 h-4 text-gray-400" />;
    if (l.includes("breakfast") || l.includes("coffee")) return <CoffeeIcon className="w-4 h-4 text-gray-400" />;
    if (l.includes("bed")) return <BedIcon className="w-4 h-4 text-gray-400" />;
    if (l.includes("air conditioner")) return <AirVent className="w-4 h-4 text-gray-400" />;
    return null;
  };

  // compute badge + display prices
  const { badgeText, displayPrice, displayOldPrice } = computeBadgeAndDisplay({
    badge,
    priceNumbers,
    price,
    oldPrice,
  });

  // ensure image src is safe (returns placeholder when invalid)
  const safeSrc = safeImageSrc(src);

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
          loading="lazy"    // lazy loading for network efficiency / best practice
          decoding="async"  // let browser decode off main thread where supported
        />

        {/* BADGE - top-left */}
        {badgeText && (
          <div className="absolute left-4 top-4 bg-black/85 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {badgeText}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="px-6 py-5">
        {offerType && <p className="text-sm text-gray-500 mb-2">{offerType}</p>}

        {/* TITLE + BEDS */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h3>

          <div className="flex items-center gap-2 text-gray-800">
            <UserRound className="w-4 h-4 text-gray-700 font-bold text-sm" />
            <div className="font-medium text-sm">{beds ?? noOfPeople ?? "-"}</div>
          </div>
        </div>

        {/* AMENITIES */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 items-center text-sm text-gray-500">
            {amenities.map((a, i) => (
              <div className="flex items-center gap-2" key={a.key ?? `${a.label}-${i}`}>
                <span className="flex items-center">{amenityIcon(a.label)}</span>
                <span className="truncate">{a.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* optional description */}
        {description && <p className="text-sm text-gray-600 mt-3">{description}</p>}

        {/* PRICE ROW */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            {/* old price (light) */}
            {displayOldPrice && (
              <div className="inline-flex items-center border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-500 mb-2">
                <span className="line-through">{displayOldPrice}</span>
              </div>
            )}

            {/* price badge with hover highlight */}
            <div className="mt-1 inline-block rounded-md border border-gray-200 px-4 py-3 transition-shadow duration-300 group-hover:shadow-lg">
              <div className="text-red-700 font-extrabold text-xl transition-transform duration-300 group-hover:scale-105">
                {displayPrice ?? price ?? "-"}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">/Per night</div>
        </div>
      </div>
    </article>
  );
}
