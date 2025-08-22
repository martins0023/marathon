// components/Hero.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, Transition } from "framer-motion";

/**
 * Animated Hero Carousel (fixed TypeScript transition typing)
 *
 * - 3 images slide horizontally with smooth easing
 * - Autoplay with pause-on-hover and pause-while-dragging
 * - Pagination dots synced to the active slide (clickable)
 * - Drag-to-swipe support (desktop & touch)
 *
 * Replace the image paths if needed.
 */

const IMAGES = [
  { src: "/images/hero-1.png", alt: "Hero image 1" },
  { src: "/images/hero-2.jpg", alt: "Hero image 2" },
  { src: "/images/hero-3.jpg", alt: "Hero image 3" },
];

const AUTOPLAY_INTERVAL = 4000; // ms
// typed transition: use `as const` for `type` and tuple typing for `ease` so TS accepts them
const TRANSITION: Transition = {
  type: "tween" as const,
  ease: [0.22, 0.1, 0.12, 0.95] as [number, number, number, number],
  duration: 0.8,
};

export default function Hero() {
  const [index, setIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const autoplayRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  // autoplay effect
  useEffect(() => {
    if (isPaused) return;

    autoplayRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isPaused]);

  // navigation helpers
  const goTo = (i: number) =>
    setIndex(Math.max(0, Math.min(i, IMAGES.length - 1)));
  const next = () => setIndex((i) => (i + 1) % IMAGES.length);
  const prev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);

  // drag handling (swipe)
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 80; // px swipe threshold
    const deltaX = info.offset.x;

    draggingRef.current = false;
    setIsPaused(false); // resume autoplay after drag

    if (deltaX > threshold) {
      // dragged right -> previous slide
      prev();
    } else if (deltaX < -threshold) {
      // dragged left -> next slide
      next();
    }
    // else: small drag -> snap back (no index change)
  };

  // Pause on hover/focus
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => {
    if (!draggingRef.current) setIsPaused(false);
  };

  return (
    <section
      className="relative"
      aria-label="Hero carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-[85vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
        {/* Slider track */}
        <motion.div
          // animate track by percentage based on index
          animate={{ x: `-${index * 100}%` }}
          transition={TRANSITION}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => {
            draggingRef.current = true;
            setIsPaused(true);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex h-full"
          style={{ touchAction: "pan-y" }} // allow vertical page scroll
        >
          {IMAGES.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="relative w-full flex-none h-full"
              aria-hidden={index !== i}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                priority={i === 0} // prefer loading first
                sizes="100vw"
                style={{ objectPosition: "center center" }}
              />
              <div className="absolute inset-0 bg-black/35 pointer-events-none" />
            </div>
          ))}
        </motion.div>

        {/* Content overlay centered */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="container max-w-4xl">
            {/* small accent marks above heading */}
            <div className="inline-block mb-6">
              <div className="w-12 h-2 rounded-full bg-[#b61e2e] -rotate-12 inline-block mr-2" />
              <div className="w-8 h-2 rounded-full bg-[#b61e2e] -rotate-12 inline-block" />
            </div>

            <h1 className="font-orelega font-semibold pt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight drop-shadow-md">
              Feel the comfort of home away from home
            </h1>

            <p className="mt-5 text-md sm:text-lg leading-relaxed text-white max-w-2xl mx-auto drop-shadow-sm">
              Experience modern stays, curated hospitality, and perfect
              locations for work or relaxation.
            </p>

            <div className="mt-12 pt-4 hover:ease-out">
              <a
                href="#rooms"
                className="px-10 py-5 uppercase bg-white text-[#1f2937] font-semibold shadow-md hover:border-primary border-2 hover:bg-gradient-to-l from-orange-100 to-red-200 transition-colors"
              >
                Explore Rooms
              </a>
            </div>

            {/* Pagination dots (centered below content) */}
            <div className="mt-14 flex justify-center">
              <div className="flex gap-3 items-center">
                {IMAGES.map((_, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={`dot-${i}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      aria-current={active ? "true" : "false"}
                      className="w-3 h-3 rounded-full p-0 flex items-center justify-center"
                    >
                      <motion.span
                        layout
                        initial={false}
                        animate={{
                          scale: active ? 1.45 : 1,
                          backgroundColor: active
                            ? "rgba(182,30,46,1)"
                            : "#fff",
                          boxShadow: active
                            ? "0 6px 18px rgba(182,30,46,0.24)"
                            : "none",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                        }}
                        className="block w-full h-full rounded-full"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* left/right simple nav (optional & accessible) */}
        <div className="absolute inset-y-0 left-4 hidden sm:flex items-center pointer-events-auto lg:left-8">
          <button
            onClick={() => {
              setIsPaused(true);
              prev();
            }}
            aria-label="Previous slide"
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="absolute inset-y-0 right-4 hidden sm:flex items-center pointer-events-auto lg:right-8">
          <button
            onClick={() => {
              setIsPaused(true);
              next();
            }}
            aria-label="Next slide"
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
