// utils/dateUtils.ts
import { parseISO } from "date-fns";

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function isRoomNumberAvailableForRange(
  roomNumber: any, 
  checkInISO?: string | null, 
  checkOutISO?: string | null
): boolean {
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