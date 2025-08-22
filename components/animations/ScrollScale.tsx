// components/animations/ScrollScale.tsx
"use client";
import React, { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollScaleProps {
  children: ReactNode;
  min?: number; // min scale
  max?: number; // max scale
  vertical?: boolean; // whether to map to Y progress or X
  amount?: number; // multiplier (not often needed)
  className?: string;
}

/**
 * Simple scale-parallax driven by element's scroll progress.
 * Maps scroll progress [0,1] to scale [min,max].
 */
export default function ScrollScale({
  children,
  min = 1,
  max = 1.07,
  vertical = true,
  amount = 1,
  className = "",
}: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [min, max * amount]);
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 20 });

  return (
    <motion.div ref={ref} style={{ scale: smoothScale }} className={className}>
      {children}
    </motion.div>
  );
}
