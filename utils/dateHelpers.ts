// utils/dateHelpers.ts
export const todayISO = (): string => new Date().toISOString().split("T")[0];

export const addDaysISO = (d: string, days: number): string => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().split("T")[0];
};

export const calculateNights = (arrivalDate: string, departureDate: string): number => {
  if (!arrivalDate || !departureDate) return 0;
  return Math.max(1, (new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) / (1000 * 60 * 60 * 24));
};