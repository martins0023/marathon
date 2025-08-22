import Image from "next/image";
import React from "react";
import ScrollParallax from "./ScrollParallax";
import ScrollReveal from "./ScrollReveal";

export default function QualityCTA() {
  return (
    <section className="relative mt-20 bg-[#2b2b2b] text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Top-left red strokes */}
          <div className="absolute top-24 left-24 hidden lg:block">
            <svg
              width="60"
              height="30"
              viewBox="0 0 60 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 0L0 30H15L25 0H10Z" fill="#C71F35" />
              <path d="M45 0L35 30H50L60 0H45Z" fill="#C71F35" />
            </svg>
          </div>
          {/* Top-right red strokes */}
          <div className="absolute top-48 right-1/4 hidden lg:block">
            <svg
              width="60"
              height="30"
              viewBox="0 0 60 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 0L0 30H15L25 0H10Z" fill="#C71F35" />
              <path d="M45 0L35 30H50L60 0H45Z" fill="#C71F35" />
            </svg>
          </div>
          {/* Bottom-left red arc */}
          <div className="absolute bottom-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full border-[60px] border-primary" />
          {/* Bottom-right red arc */}
          <div className="absolute bottom-[-150px] right-[-150px] w-[300px] h-[300px] rounded-full border-[60px] border-primary" />
        </div>
      </div>

      {/* Main container with text and image */}
      <div className="container relative z-10 py-16 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        {/* Text and button container */}
        <div className="flex-1 max-w-lg lg:pr-10 text-center lg:text-left">
          <ScrollReveal offsetY={36} className="max-w-xl">
          <h4 className="text-3xl sm:text-4xl font-bold font-orelega">
            Quality food & service
          </h4>
          <p className="mt-3 text-gray-300 max-w-md mx-auto lg:mx-0">
            We strive to bring the best meals to you with our large base of
            restaurants.
          </p>
          <div className="mt-8">
            <button className="px-20 py-6 bg-white uppercase text-primary font-semibold hover:bg-gray-200 transition-colors shadow-md">
              View Restaurants
            </button>
          </div>
          </ScrollReveal>
        </div>
        {/* Image container */}
        <ScrollParallax amount={110} amountX={18} className="flex-1 relative w-full lg:max-w-xl h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
          {/* Small-screen optimized image (uses explicit width/height and is visible on xs only) */}
          <div className="block sm:hidden relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/images/food-plate.png"
              alt="food"
              width={900}
              height={700}
              priority
              className="object-cover w-full h-full"
            />
          </div>
          <Image
            src="/images/food-plate.png"
            alt="food"
            fill
            className="object-contain"
          />
        </ScrollParallax>
      </div>
    </section>
  );
}