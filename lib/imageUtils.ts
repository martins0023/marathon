// lib/imageUtils.ts
export type MaybeImage = string | null | undefined | Record<string, any>;

/**
 * NOTE:
 * This file tries to be defensive but not overly strict.
 * We accept absolute http(s) URLs even if they contain suspicious substrings
 * like "undefined" because next/image can accept them and Cloudinary will
 * serve them. For relative paths we remain strict.
 */

const PLACEHOLDER = "/images/bedroom.png";

/** quick check for http(s) absolute urls */
export function isAbsoluteHttpUrl(s: string) {
  return /^https?:\/\//i.test(s);
}

/** trim + reject obviously invalid strings */
function cleanStringTrim(s?: string | null) {
  if (!s || typeof s !== "string") return null;
  const t = s.trim();
  if (!t) return null;
  const lower = t.toLowerCase();
  // reject bare tokens "null" or "undefined"
  if (lower === "null" || lower === "undefined") return null;
  // reject obviously broken sequences
  if (t.includes("..//")) return null;
  return t;
}

/** Build Cloudinary URL only if cloud name present AND publicId looks sane-ish */
function buildCloudinaryUrlFromPublicId(publicId?: string | null) {
  const cleaned = cleanStringTrim(publicId);
  if (!cleaned) return null;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return null;

  // The publicId may still contain "undefined" or odd tokens — but this is a backend bug.
  // We still build a Cloudinary URL here because it's the most direct representation.
  return `https://res.cloudinary.com/${cloudName}/image/upload/${encodeURI(cleaned)}`;
}

/**
 * Try to extract a usable url (absolute or relative) from `entry`.
 * Returns string or null.
 *
 * Strategy:
 *  - If the entry is a string:
 *      - if absolute http(s) -> accept (even if contains 'undefined')
 *      - if startsWith('/') -> accept (relative path)
 *      - else treat as a possible public_id (later)
 *  - If the entry is an object:
 *      - check common url fields and accept absolute or relative paths
 *      - if no usable url found, check public_id-like fields and try to build a Cloudinary URL
 */
function extractUrlFromEntry(entry: MaybeImage): string | null {
  if (!entry) return null;

  // 1) string shortcut
  if (typeof entry === "string") {
    const t = cleanStringTrim(entry);
    if (!t) return null;
    if (isAbsoluteHttpUrl(t)) return t;
    if (t.startsWith("/")) return t;
    // Not absolute or relative — maybe it's a cloudinary public id (without leading path)
    // Let caller decide whether to try building cloudinary url via public id
    return t;
  }

  // 2) object: try common url fields first
  const candidates = [
    (entry as any).url,
    (entry as any).secure_url,
    (entry as any).secureUrl,
    (entry as any).src,
    (entry as any).image,
    (entry as any).path,
    (entry as any).publicUrl,
    (entry as any).data?.url,
    (entry as any).data?.secure_url,
    (entry as any).attributes?.url,
    (entry as any).attributes?.secure_url,
  ];

  for (const c of candidates) {
    if (typeof c !== "string") continue;
    const t = c.trim();
    if (!t) continue;
    if (isAbsoluteHttpUrl(t)) return t; // accept absolute URLs even if they contain "undefined"
    if (t.startsWith("/")) return t; // accept relative paths
  }

  // 3) try public_id-like fields (public_id, id, etc.)
  const publicIdCandidates = [
    (entry as any).public_id,
    (entry as any).publicId,
    (entry as any).publicID,
    (entry as any).id,
    (entry as any)._id,
  ];

  for (const pid of publicIdCandidates) {
    if (!pid) continue;
    const cleanedPid = cleanStringTrim(String(pid));
    if (!cleanedPid) continue;
    const built = buildCloudinaryUrlFromPublicId(cleanedPid);
    if (built) return built;
  }

  return null;
}

/**
 * Given images array return first valid image url (absolute or relative),
 * or null if none found.
 */
export function getFirstValidImage(images?: MaybeImage[] | null): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) return null;

  for (const img of images) {
    try {
      const url = extractUrlFromEntry(img);
      if (!url) continue;

      // If it's an absolute URL (http/https), accept it
      if (isAbsoluteHttpUrl(url)) return url;

      // If it is a relative path starting with '/', accept it
      if (url.startsWith("/")) return url;

      // Otherwise, if it looks like a short path (e.g. 'uploads/xxx') and cloud name exists,
      // attempt to build a Cloudinary URL
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (cloudName) {
        // simple heuristic: if url contains a slash or 'uploads', accept building
        if (url.includes("/") || url.startsWith("uploads") || url.match(/^[\w-]+$/)) {
          return `https://res.cloudinary.com/${cloudName}/image/upload/${encodeURI(url)}`;
        }
      }

      // nothing usable for this entry -> continue
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("getFirstValidImage: failed to check image entry", e, img);
      continue;
    }
  }

  return null;
}

/**
 * Defensive wrapper: returns a valid src for next/image, else placeholder
 */
export function safeImageSrc(src?: string | null): string {
  if (!src || typeof src !== "string") return PLACEHOLDER;
  const trimmed = src.trim();
  if (!trimmed) return PLACEHOLDER;
  // Accept absolute http(s)
  if (isAbsoluteHttpUrl(trimmed)) return trimmed;
  // Accept leading slash relative paths
  if (trimmed.startsWith("/")) return trimmed;
  // If it's a short relative path, try to build Cloudinary if cloud name present
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (cloudName) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${encodeURI(trimmed)}`;
  }
  return PLACEHOLDER;
}
