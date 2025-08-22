// components/ScrollParallax.tsx
import React, { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollParallaxProps {
  children: ReactNode;
  /**
   * Maximum vertical translation in px (positive moves element down when progress=0 -> negative moves up).
   * We'll map progress [0,1] to [amount, -amount] so element moves in opposite direction to scroll.
   */
  amount?: number;
  /**
   * Optional horizontal parallax (px)
   */
  amountX?: number;
  className?: string;
}

/**
 * ScrollParallax - wraps an element and applies a smooth parallax transform based on scroll progress
 */
export default function ScrollParallax({
  children,
  amount = 80,
  amountX = 0,
  className = "",
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // progress for the element entering viewport: 0 when bottom of viewport hits top of element, 1 when top hits bottom
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // map progress to transform ranges
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const x = useTransform(scrollYProgress, [0, 1], [-amountX, amountX]);

  // smooth the raw transform values
  const smoothY = useSpring(y, { stiffness: 80, damping: 24 });
  const smoothX = useSpring(x, { stiffness: 80, damping: 24 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, x: smoothX }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
