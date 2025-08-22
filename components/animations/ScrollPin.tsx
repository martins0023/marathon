// components/animations/ScrollPin.tsx
"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface ScrollPinProps {
  children: ReactNode;
  /** stickyTop allows the pin to sit at a particular top offset */
  stickyTop?: number | string; // px or percent (e.g. "20px" or "10vh")
  className?: string;
  pinClassName?: string;
}

/**
 * ScrollPin - simple sticky container that pins child content while the section is in view.
 * Useful for side-hero, media, or controlling a pinned element during scrolling.
 *
 * Implementation: uses CSS `position: sticky` for perf; motion wrappers allow further animations if desired.
 */
export default function ScrollPin({
  children,
  stickyTop = "8vh",
  className = "",
  pinClassName = "",
}: ScrollPinProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative"
        style={{
          // container height should be set by parent section if you need longer pin duration
        }}
      >
        <div
          className={`sticky top-0`}
          style={{ top: stickyTop as any }}
        >
          <motion.div
            className={pinClassName}
            initial={{ y: 0 }}
            whileInView={{ y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
