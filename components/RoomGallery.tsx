// components/RoomGallery.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollFade } from "./animations";

interface RoomGalleryProps {
  images: string[];
  title: string;
}

export default function RoomGallery({ images, title }: RoomGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => { 
    if (showGallery) setModalIndex(activeIndex); 
  }, [showGallery, activeIndex]);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (showGallery) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showGallery]);

  useEffect(() => {
    if (!images || images.length === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex >= images.length) setActiveIndex(0);
  }, [images, activeIndex]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 rounded-2xl overflow-hidden">
          <ScrollFade offsetY={24} start={0.08} end={0.4}>
            <motion.div
              key={images[activeIndex]}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              <div className="relative w-full h-[54vh] md:h-[60vh] lg:h-[72vh] rounded-2xl overflow-hidden">
                <Image
                  src={images[activeIndex]}
                  alt={`${title} image`}
                  fill
                  sizes="(min-width:1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </ScrollFade>
        </div>

        {/* Thumbnails */}
        <div className="w-full md:w-[140px]">
          <div className={`flex gap-4 md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0`} style={{ WebkitOverflowScrolling: "touch" }}>
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-xl overflow-hidden flex-shrink-0 min-w-[84px] md:min-w-full border ${i === activeIndex ? "border-primary" : "border-transparent"} focus:outline-none`}
                aria-label={`Show image ${i + 1}`}
              >
                <div className="relative w-[84px] h-20 md:w-full md:h-24 lg:h-28">
                  <Image src={img} alt={`thumb ${i}`} fill className="object-cover" />
                  <div className={`absolute inset-0 ${i === activeIndex ? "ring-2 ring-primary/40" : "bg-black/0"} transition-all`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 md:hidden">
        <button
          onClick={() => {
            setModalIndex(activeIndex);
            setShowGallery(true);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow text-sm"
          aria-label="Show all photos"
        >
          <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 7h4l2-3h6l2 3h4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Show all photos
        </button>
      </div>

      {/* Gallery Modal / Lightbox */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            className="fixed inset-0 z-60 flex items-center justify-center" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.22 }} 
            onClick={() => setShowGallery(false)}
          >
            <motion.div 
              className="absolute inset-0 bg-black/75" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.22 }} 
            />
            <motion.div 
              className="relative z-70 w-full max-w-4xl mx-4 md:mx-8 lg:mx-0 rounded-lg overflow-hidden" 
              initial={{ y: 24, scale: 0.98 }} 
              animate={{ y: 0, scale: 1 }} 
              exit={{ y: 12, opacity: 0 }} 
              transition={{ duration: 0.28 }} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[56vh] md:h-[72vh] bg-black/5">
                <Image 
                  src={images[modalIndex]} 
                  alt={`modal ${modalIndex + 1}`} 
                  fill 
                  className="object-contain bg-black" 
                  sizes="(min-width:1024px) 800px, 100vw" 
                />
              </div>

              <button 
                onClick={() => setModalIndex((i) => (i - 1 + images.length) % images.length)} 
                aria-label="Previous image" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-80 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full" 
                style={{ backdropFilter: "blur(4px)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button 
                onClick={() => setModalIndex((i) => (i + 1) % images.length)} 
                aria-label="Next image" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-80 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full" 
                style={{ backdropFilter: "blur(4px)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="bg-white/95 py-3 px-4 flex items-center gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button 
                    key={`modal-thumb-${img}-${i}`} 
                    onClick={() => setModalIndex(i)} 
                    className={`flex-shrink-0 rounded-md overflow-hidden ${i === modalIndex ? "ring-2 ring-primary/50" : ""}`} 
                    style={{ minWidth: 84 }} 
                    aria-label={`Show image ${i + 1}`}
                  >
                    <div className="relative w-[84px] h-20">
                      <Image src={img} alt={`modal thumb ${i}`} fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowGallery(false)} 
                aria-label="Close gallery" 
                className="absolute top-3 right-3 z-90 bg-white/90 p-2 rounded-full"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
