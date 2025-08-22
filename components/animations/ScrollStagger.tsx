// components/animations/ScrollStagger.tsx
"use client";
import React, { ReactNode, useRef, Children } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface ScrollStaggerProps {
  children: ReactNode;
  stagger?: number; // seconds between children
  delay?: number;
  className?: string;
  threshold?: number; // in-view threshold (0-1)
}

/**
 * ScrollStagger - reveals children with a stagger when the wrapper enters view.
 * Each child should be a plain element (div/card). This component will wrap each child with a motion.div.
 */
export default function ScrollStagger({
  children,
  stagger = 0.12,
  delay = 0,
  className = "",
  threshold = 0.15,
}: ScrollStaggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: threshold });
  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const childArray = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
      >
        {childArray.map((child, i) => (
          <motion.div
            key={(child as any)?.key ?? i}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: "easeOut" } },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
