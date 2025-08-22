"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { ArrowRightIcon, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/apartments", label: "Get direction" },
    { href: "/apartments", label: "Apartments" },
    { href: "/gallery", label: "Gallery" },
    { href: "/rooms", label: "Book room" },
  ];

  // Typed transitions so TS/Framer Motion are happy
  const PANEL_TRANSITION: Transition = {
    type: "spring" as const,
    stiffness: 110,
    damping: 20,
  };
  const OVERLAY_TRANSITION: Transition = { duration: 0.22 };

  return (
    <header className="fixed top-3 left-0 w-full z-50 pt-6">
      <div className="container">
        <div className="bg-white rounded-[1rem] shadow-sm px-6 py-4 flex items-center justify-between">
          {/* Left nav (desktop) */}
          <nav className="hidden md:flex items-center gap-16 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/apartments"
              className="hover:text-primary transition-colors"
            >
              Get direction
            </Link>
          </nav>

          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`text-xl font-orelega tracking-wider`}
              aria-label="Marathon Home"
            >
              <Image
                src="/images/logo.svg"
                alt="logo"
                height={55}
                width={55}
                className="w-31 h-31"
              />
            </Link>
          </div>

          {/* Right nav (desktop) */}
          <nav className="hidden md:flex items-center gap-16 text-sm font-medium">
            <Link
              href="/apartments"
              className="hover:text-primary transition-colors"
            >
              Apartments
            </Link>
            <Link
              href="/gallery"
              className="hover:text-primary transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2 border-2 border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Book room
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-800 focus:outline-none"
              onClick={() => setIsOpen((s) => !s)}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay + Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Blurred background overlay (fades in/out) */}
            <motion.button
              // using a button so it is keyboard focusable and clickable
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.44 }}
              exit={{ opacity: 0 }}
              transition={OVERLAY_TRANSITION}
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Sliding panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={PANEL_TRANSITION}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col p-6 md:hidden"
            >
              {/* header inside menu */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/logo.svg"
                    alt="logo"
                    height={44}
                    width={44}
                    className="w-11 h-auto"
                  />
                  <span className="text-lg font-semibold">Marathon</span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 focus:outline-none bg-gray-100 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* nav items with stagger + hover scale/translate */}
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
                  },
                }}
                className="flex-1 flex flex-col gap-4 text-lg font-medium"
              >
                {links.map((link) => (
                  <motion.div
                    key={link.href + link.label}
                    variants={{
                      hidden: { opacity: 0, x: 20, scale: 0.98 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: { duration: 0.42 },
                      },
                    }}
                    whileHover={{ scale: 1.1, x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="rounded-md"
                  >
                    {/* Using Link; clicking also closes menu */}
                    <Link
                      href={link.href}
                      className="block px-1 py-2 hover:text-primary hover:underline cursor-pointer transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* CTA button pinned to bottom */}
              <div className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.12 }}
                >
                  <Link
                    href="/rooms"
                    onClick={() => setIsOpen(false)}
                    className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg border-2 border-primary bg-white text-primary font-semibold hover:text-white hover:bg-[#cf2732] transition-colors"
                  >
                    Book room
                    <ArrowRightIcon className="ml-3" />
                  </Link>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
