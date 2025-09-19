// utils/priceUtils.ts
export function parsePrice(priceString: string): number {
  if (!priceString) return 0;
  // Remove currency symbol and commas, then parse as float
  const cleanedPrice = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(cleanedPrice) || 0;
}