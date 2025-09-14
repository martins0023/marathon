// lib/mappers.ts
import type { Room } from "../lib/types";
import { getFirstValidImage, safeImageSrc } from "./imageUtils";

/**
 * Offer model used by UI (keeps shape simple and focused)
 */
export type OfferUI = {
  slug: string;
  offerType: string;
  title: string;
  description: string;
  // pretty display price string (e.g. "₦200,000")
  price: string;
  // raw numeric prices (from backend price: number[])
  priceNumbers?: number[];
  // image src (safe for next/image)
  src: string;
  noOfPeople?: string;
  oldPrice?: string;
  badge?: string;
  beds?: number | string;
  amenities?: { label: string }[];
};

/** defensively coerce a value into a finite number or return NaN */
function toFiniteNumber(v: unknown): number {
  if (typeof v === "number") {
    return v;
  }
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.-]+/g, ""));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export function mapRoomToOffer(room: Room): OfferUI {
  const raw = Array.isArray(room.price) ? room.price : [];

  const numericPrices = raw
    .map((p) => toFiniteNumber(p))
    .filter((n) => Number.isFinite(n) && !Number.isNaN(n));

  const min = numericPrices.length ? Math.min(...numericPrices) : undefined;
  const max = numericPrices.length ? Math.max(...numericPrices) : undefined;

  const priceFormatted = min !== undefined ? `₦${Number(min).toLocaleString()}` : "₦0";
  const oldPrice = max !== undefined && max > (min ?? 0) ? `₦${Number(max).toLocaleString()}` : undefined;

  // Try robust extractor
  const candidate = getFirstValidImage(room.images);

  let srcFinal = "/images/bedroom.png";
  if (candidate) {
    // normalize via safeImageSrc so next/image gets something correct
    srcFinal = safeImageSrc(candidate);
  } else if (room.images && room.images.length > 0) {
    // Log the first image object so backend can be inspected/fixed.
    // eslint-disable-next-line no-console
    console.warn("[mapRoomToOffer] could not extract valid image URL for room, falling back to placeholder. Inspect room.images[0]:", room._id, room.images[0]);
    srcFinal = "/images/bedroom.png";
  }

  // Helpful debug log (client-side). Remove when done debugging.
  // eslint-disable-next-line no-console
  console.debug("[mapRoomToOffer] roomId:", room._id, { candidate, srcFinal, sampleImages: (room.images ?? []).slice(0, 2) });

  return {
    slug: room._id,
    offerType: room.room_type ?? "Room",
    title: room.title,
    description: room.desc ?? "",
    price: priceFormatted,
    priceNumbers: numericPrices,
    src: srcFinal,
    noOfPeople: String(room.max_people ?? ""),
    oldPrice,
    badge: undefined,
    beds: undefined,
    amenities: (room.amenities ?? []).map((a: any) => ({ label: a.name ?? a })),
  };
}

export function computeDrop(offer: OfferUI) {
  const nums = offer.priceNumbers ?? [];
  if (!nums || nums.length === 0) return { dropPercent: 0, dropAbsolute: 0 };
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (max <= 0) return { dropPercent: 0, dropAbsolute: 0 };
  const dropAbsolute = max - min;
  const dropPercent = Math.round(((max - min) / max) * 100);
  return { dropPercent, dropAbsolute };
}

export function getTopDroppedOffers(rooms: Room[], count = 3): OfferUI[] {
  const mapped = rooms.map(mapRoomToOffer);
  const scored = mapped.map((m) => ({ ...m, _score: computeDrop(m).dropPercent }));
  scored.sort((a, b) => (b._score ?? 0) - (a._score ?? 0));
  return scored.slice(0, count).map(({ _score, ...rest }) => rest);
}
