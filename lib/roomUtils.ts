// lib/roomUtils.ts

import { parseISO, differenceInCalendarDays } from "date-fns";
import { getFirstValidImage, safeImageSrc } from "./imageUtils";
import type { Room as RoomType } from "./types";

/**
 * Maps backend Room data to a a shape suitable for the UI.
 * @param room - The raw room data from the API.
 * @returns A mapped room object for the component.
 */
export function mapRoomForDetails(room: RoomType | null | undefined) {
  if (!room) {
    return {
      id: "",
      title: "",
      short: "",
      description: "",
      images: [safeImageSrc(null)],
      amenities: [] as string[],
      price: "₦0",
      oldPrice: undefined as string | undefined,
      beds: undefined as number | undefined,
      max_people: "",
      rawRoom: null as RoomType | null,
    };
  }

  const rawPrices = Array.isArray(room.price) ? room.price : [];
  const numericPrices = rawPrices.map((p) => (typeof p === "number" ? p : Number(p))).filter((n) => Number.isFinite(n));

  const minPrice = numericPrices.length ? Math.min(...numericPrices) : undefined;
  const maxPrice = numericPrices.length ? Math.max(...numericPrices) : undefined;

  const price = minPrice !== undefined ? `₦${Number(minPrice).toLocaleString()}` : "₦0";
  const oldPrice = maxPrice !== undefined && maxPrice > (minPrice ?? 0) ? `₦${Number(maxPrice).toLocaleString()}` : undefined;

  const imgsRaw = Array.isArray(room.images) ? room.images : [];
  const images = imgsRaw.length > 0 ? imgsRaw.map((entry) => {
    const candidate = getFirstValidImage([entry]);
    return safeImageSrc(candidate ?? null);
  }).filter(Boolean) : [safeImageSrc(null)];

  const finalImages = (images && images.length) ? images : [safeImageSrc(null)];

  const amenities = Array.isArray(room.amenities) && room.amenities.length
    ? room.amenities.map((a: any) => (typeof a === "string" ? a : a.name ?? String(a)))
    : [];

  const beds = Array.isArray(room.room_numbers) && room.room_numbers.length
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

/** Helper: checks if two date ranges overlap (inclusive start, exclusive end) */
export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

/** Helper: checks if a room number is available for the requested dates */
export function isRoomNumberAvailableForRange(roomNumber: any, checkInISO?: string | null, checkOutISO?: string | null) {
  if (!roomNumber) return false;
  if (!checkInISO || !checkOutISO) return true;
  try {
    const checkIn = parseISO(checkInISO);
    const checkOut = parseISO(checkOutISO);
    const unavailable = Array.isArray(roomNumber.unavailableDates) ? roomNumber.unavailableDates : [];
    for (const d of unavailable) {
      const blocked = parseISO(String(d));
      const blockedStart = new Date(blocked.getFullYear(), blocked.getMonth(), blocked.getDate());
      const blockedEnd = new Date(blockedStart);
      blockedEnd.setDate(blockedStart.getDate() + 1);
      if (rangesOverlap(checkIn, checkOut, blockedStart, blockedEnd)) {
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn("isRoomNumberAvailableForRange: parse error", err, roomNumber, checkInISO, checkOutISO);
    return false;
  }
}

/**
 * Computes related rooms from a list, excluding the current room and mapping them for the UI.
 * @param allRooms - A list of all available rooms.
 * @param currentRoom - The currently viewed room.
 * @returns An array of related room offers.
 */
export function computeRelatedRooms(allRooms: any[] | undefined, currentRoom: any) {
  if (!allRooms || !currentRoom) return [];
  const others = allRooms.filter((r) => r._id !== currentRoom._id);
  const mapped = others.slice(0, 6).map((r) => {
    const img = getFirstValidImage(r.images) ?? null;
    const minPrice = Array.isArray(r.price) && r.price.length ? Math.min(...r.price.map((p: any) => Number(p))) : undefined;
    const priceStr = minPrice !== undefined ? `₦${Number(minPrice).toLocaleString()}` : "₦0";
    const oldPrice = Array.isArray(r.price) && r.price.length ? `₦${Math.max(...r.price.map((p: any) => Number(p))).toLocaleString()}` : undefined;
    return {
      slug: r._id,
      title: r.title,
      description: r.desc ?? "",
      price: priceStr,
      src: safeImageSrc(img ?? null),
      oldPrice,
      noOfPeople: String(r.max_people ?? ""),
    };
  });
  return mapped.slice(0, 3);
}

/**
 * Computes the nightly price of a room.
 * @param rawRoom - The raw room data object.
 * @returns The minimum nightly price as a number.
 */
export function getNightlyPrice(rawRoom: any) {
  if (!rawRoom) return 0;
  const raw = Array.isArray(rawRoom.price) ? rawRoom.price : [];
  const nums = raw.map((p: any) => (typeof p === "number" ? p : Number(p))).filter((n: unknown) => Number.isFinite(n));
  return nums.length ? Math.min(...nums) : 0;
}

/**
 * Validates booking dates and guest count.
 * @param values - The guest details form values.
 * @param maxPeople - The maximum number of guests allowed for the room.
 * @returns A tuple of `[isValid, errorMessage, parsedCheckInDate, parsedCheckOutDate]`.
 */
export function validateBooking(values: any, maxPeople: number) {
  const arrival = (values.arrivalDate || values.arrival_date || values.checkIn || values.check_in);
  const departure = (values.departureDate || values.departure_date || values.checkOut || values.check_out);
  const guestsTotal = Number(values.guests ?? values.guestsCount ?? 1);

  if (!arrival || !departure) {
    return [false, "Please provide arrival and departure dates.", null, null];
  }

  let checkInDate: Date, checkOutDate: Date;
  try {
    checkInDate = typeof arrival === "string" ? parseISO(arrival) : new Date(arrival);
    checkOutDate = typeof departure === "string" ? parseISO(departure) : new Date(departure);
  } catch (err) {
    return [false, "Invalid dates provided.", null, null];
  }

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return [false, "Invalid dates provided.", null, null];
  }
  if (checkOutDate <= checkInDate) {
    return [false, "Departure date must be after arrival date.", null, null];
  }
  if (maxPeople > 0 && guestsTotal > maxPeople) {
    return [false, `This room supports up to ${maxPeople} guests. Please reduce the number of guests.`, null, null];
  }

  return [true, null, checkInDate, checkOutDate];
}

/**
 * Prepares the booking payload.
 * @param payload - The initial payload object.
 * @param checkInDate - The parsed check-in date.
 * @param checkOutDate - The parsed check-out date.
 * @param guestsTotal - The total number of guests.
 * @param nightlyPrice - The nightly price of the room.
 * @returns The final booking payload.
 */
export function prepareBookingPayload(payload: any, checkInDate: Date, checkOutDate: Date, guestsTotal: number, nightlyPrice: number) {
  const nights = Math.max(1, differenceInCalendarDays(checkOutDate, checkInDate));
  const totalPrice = nightlyPrice * nights;
  return {
    ...payload,
    checkIn: checkInDate.toISOString(),
    checkOut: checkOutDate.toISOString(),
    guest: [{ adults: guestsTotal, children: 0 }],
    totalPrice,
  };
}