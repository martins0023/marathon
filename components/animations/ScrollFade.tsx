// components/animations/ScrollFade.tsx
"use client";
import React, { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollFadeProps {
  children: ReactNode;
  offsetY?: number; // start offset for translateY
  start?: number; // progress start (0-1)
  end?: number; // progress end (0-1)
  className?: string;
  delay?: number; // small delay multiplier for progression
}

export default function ScrollFade({
  children,
  offsetY = 40,
  start = 0.12,
  end = 0.45,
  delay = 0,
  className = "",
}: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"],
  });

  const s = Math.min(Math.max(start + delay * 0.05, 0), 1);
  const e = Math.min(Math.max(end + delay * 0.05, 0), 1);

  const opacity = useTransform(scrollYProgress, [s, e], [0, 1]);
  const y = useTransform(scrollYProgress, [s, e], [offsetY, 0]);

  const smoothOpacity = useSpring(opacity, { stiffness: 90, damping: 22 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 22 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity: smoothOpacity, translateY: smoothY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
