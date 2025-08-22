// components/ScrollReveal.tsx
import React, { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  /**
   * vertical offset in px to start (will animate to 0).
   */
  offsetY?: number;
  /**
   * delay before animation begins (seconds)
   */
  delay?: number;
  /**
   * how much of the element must be inside viewport to consider animation start
   * value uses the mapping in useScroll offset below (tweak if needed)
   */
  className?: string;
}

/**
 * ScrollReveal - drives opacity and translateY from the element's scroll progress.
 * This produces a reveal that tracks scroll rather than a one-off animation, so it feels "seamless".
 */
export default function ScrollReveal({
  children,
  offsetY = 40,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"],
  });

  // map progress to opacity and translate
  const opacity = useTransform(scrollYProgress, [0.15 + delay * 0.1, 0.45 + delay * 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0.15 + delay * 0.1, 0.45 + delay * 0.1], [offsetY, 0]);

  const smoothOpacity = useSpring(opacity, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 22 });

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: smoothOpacity,
        translateY: smoothY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
