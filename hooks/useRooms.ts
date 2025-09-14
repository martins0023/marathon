// hooks/useRooms.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";
import type { Room } from "../lib/types";

/**
 * Fetch all rooms (existing hook — behavior unchanged).
 * Backend endpoint expected: GET /api/room -> returns Room[]
 */
export function useRooms() {
  return useQuery<Room[], Error>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const rooms = await apiFetch<Room[]>("/api/room");
      return rooms;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}

/**
 * Fetch a single room by slug (or id).
 *
 * - Uses a tolerant strategy: tries /api/room/:slug, then /api/room?slug=..., then /api/room?id=...
 * - Falls back to fetching all rooms and matching client-side if necessary.
 * - Only runs when `slug` is truthy (enabled: !!slug).
 *
 * Returns Room | null (query will be disabled if slug is falsy).
 */
export function useRoom(slug?: string | null) {
  return useQuery<Room | null, Error>({
    queryKey: ["room", slug],
    queryFn: async () => {
      if (!slug) return null;

      const tried: { url: string; ok: boolean; error?: any }[] = [];

      const tryFetch = async (url: string) => {
        try {
          const res = await apiFetch<Room | null>(url);
          if (res === null || res === undefined) {
            tried.push({ url, ok: false });
            return null;
          }
          tried.push({ url, ok: true });
          return res;
        } catch (err) {
          tried.push({ url, ok: false, error: err });
          return null;
        }
      };

      // 1) RESTy route
      const a = await tryFetch(`/api/room/${encodeURIComponent(slug)}`);
      if (a) return a;

      // 2) Query param slug
      const b = await tryFetch(`/api/room?slug=${encodeURIComponent(slug)}`);
      if (b) return b;

      // 3) Query param id
      const c = await tryFetch(`/api/room?id=${encodeURIComponent(slug)}`);
      if (c) return c;

      // 4) Last resort: fetch all and search client-side
      try {
        const all = await apiFetch<Room[]>("/api/room");
        if (Array.isArray(all)) {
          const found = all.find(
            (r) =>
              r._id === slug ||
              String(r._id) === String(slug) ||
              r.title === slug ||
              String(r.title) === String(slug)
          );
          if (found) return found;
        }
      } catch (err) {
        // swallow — will throw below
      }

      throw new Error(
        `Room not found for slug/id "${slug}". Tried endpoints: ${tried
          .map((t) => `${t.url} (ok=${t.ok})`)
          .join(", ")}`
      );
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
