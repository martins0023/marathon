// utils/relatedRoomsMapper.ts
import { getFirstValidImage, safeImageSrc } from "../lib/imageUtils";
import type { Room as RoomType } from "../lib/types";

export interface RelatedRoom {
  slug: string;
  title: string;
  description: string;
  price: string;
  src: string;
  noOfPeople: string;
  oldPrice?: string;
}

export function mapRelatedRooms(allRooms: RoomType[] | undefined, currentRoomData: RoomType | undefined): RelatedRoom[] {
  if (!allRooms || !currentRoomData) return [];
  
  const others = allRooms.filter((r) => r._id !== currentRoomData._id);
  const mapped = others.slice(0, 6).map((r) => {
    const img = getFirstValidImage(r.images) ?? null;
    const minPrice = Array.isArray(r.price) && r.price.length ? Math.min(...r.price.map((p) => Number(p))) : undefined;
    const priceStr = minPrice !== undefined ? `₦${Number(minPrice).toLocaleString()}` : "₦0";
    const oldPrice = Array.isArray(r.price) && r.price.length ? `₦${Math.max(...r.price.map((p) => Number(p))).toLocaleString()}` : undefined;
    
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