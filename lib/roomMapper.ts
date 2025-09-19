// utils/roomMapper.ts
import { getFirstValidImage, safeImageSrc } from "../lib/imageUtils";
import type { Room as RoomType } from "../lib/types";

export interface MappedRoom {
  priceNumbers: any;
  id: string;
  title: string;
  short: string;
  description: string;
  images: string[];
  amenities: string[];
  price: string;
  oldPrice?: string;
  beds?: number;
  max_people: string;
  rawRoom: RoomType | null;
}

export function mapRoomForDetails(room: RoomType | null | undefined): MappedRoom {
  if (!room) {
    return {
      id: "",
      title: "",
      short: "",
      description: "",
      images: [safeImageSrc(null)],
      amenities: [],
      price: "₦0",
      oldPrice: undefined,
      beds: undefined,
      max_people: "",
      rawRoom: null,
    };
  }

  const rawPrices = Array.isArray(room.price) ? room.price : [];
  const numericPrices = rawPrices
    .map((p) => (typeof p === "number" ? p : Number(p)))
    .filter((n) => Number.isFinite(n));

  const minPrice = numericPrices.length ? Math.min(...numericPrices) : undefined;
  const maxPrice = numericPrices.length ? Math.max(...numericPrices) : undefined;

  const price = minPrice !== undefined ? `₦${Number(minPrice).toLocaleString()}` : "₦0";
  const oldPrice = maxPrice !== undefined && maxPrice > (minPrice ?? 0) ? `₦${Number(maxPrice).toLocaleString()}` : undefined;

  const imgsRaw = Array.isArray(room.images) ? room.images : [];
  const images =
    imgsRaw.length > 0
      ? imgsRaw.map((entry) => {
          const candidate = getFirstValidImage([entry]);
          return safeImageSrc(candidate ?? null);
        }).filter(Boolean)
      : [safeImageSrc(null)];

  const finalImages = (images && images.length) ? images : [safeImageSrc(null)];

  const amenities =
    Array.isArray(room.amenities) && room.amenities.length
      ? room.amenities.map((a: any) => (typeof a === "string" ? a : a.name ?? String(a)))
      : [];

  const beds =
    Array.isArray(room.room_numbers) && room.room_numbers.length
      ? room.room_numbers.length
      : undefined;

  return {
    id: room._id,
    title: room.title,
    short: room.desc ? (room.desc.length > 150 ? `${room.desc.slice(0, 150)}...` : room.desc) : "",
    description: room.desc ?? "",
    images: finalImages,
    amenities,
    price,
    oldPrice,
    beds,
    max_people: String(room.max_people ?? ""),
    rawRoom: room,
  };
}
