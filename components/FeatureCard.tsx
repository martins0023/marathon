import Image from "next/image";
import React from "react";
import { ScrollFade } from "./animations";

interface FeatureCardProps {
  title: string;
  src: string;
  /**
   * If true, this card will span two rows on md+ screens and use a taller aspect ratio.
   */
  large?: boolean;
  className?: string;
}

export default function FeatureCard({
  title,
  src,
  large = false,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`relative w-full rounded-[2rem] overflow-hidden group shadow-lg ${className}`}
      role="button"
      tabIndex={0}
      aria-label={title}
    >
      {/* use different aspect ratios for large (tall) vs normal (square) cards */}
      <ScrollFade>
        <div
          className={`relative ${
            large
              ? "aspect-[3/4] md:aspect-[4/4]" // taller on larger screens
              : "aspect-square"
          }`}
        >
          <Image
            src={src}
            alt={title}
            fill
            sizes="(min-width: 1024px) 35vw, (min-width: 768px) 48vw, 100vw"
            className="object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-500 will-change-transform"
            priority={large} // load large/tall image with priority
          />

          {/* overlay gradient + title */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-black/85 to-transparent flex items-end p-8">
            <h3
              className={`w-full text-white text-center font-semibold text-[1.25rem] md:text-[1.6rem] lg:text-[1.25rem] drop-shadow-lg ${
                large ? "text-left" : "text-left"
              }`}
              style={{ lineHeight: 1.05 }}
            >
              {title}
            </h3>
          </div>

          {/* subtle focus ring for keyboard users */}
          <div className="absolute inset-0 rounded-[2rem] focus:outline-none group-focus:ring-4 group-focus:ring-white/30" />
        </div>
      </ScrollFade>
    </div>
  );
}
