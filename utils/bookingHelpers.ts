// utils/bookingHelpers.ts
export function parseIsoDate(s?: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function msToTimeParts(ms: number) {
  if (ms <= 0) return { minutes: 0, seconds: 0, total: 0 };
  const total = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { minutes, seconds, total };
}

export function formatCountdown(ms: number) {
  const { minutes, seconds } = msToTimeParts(ms);
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
}
