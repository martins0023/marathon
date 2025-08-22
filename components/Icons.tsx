// components/icons.tsx
import React from "react";
import type { LucideProps } from "lucide-react";
import { Bed, Wifi, Coffee } from "lucide-react";

/**
 * Small wrapper re-export for lucide-react icons so components import from one place.
 * Each returns an SVG that respects currentColor and accepts className / other LucideProps.
 */

export const BedIcon = (props: LucideProps) => <Bed {...props} />;
export const WifiIcon = (props: LucideProps) => <Wifi {...props} />;
export const CoffeeIcon = (props: LucideProps) => <Coffee {...props} />;

// You can add more shared icons here in future.
export default {
  BedIcon,
  WifiIcon,
  CoffeeIcon,
};
