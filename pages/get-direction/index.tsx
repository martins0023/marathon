// pages/get-direction/index.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Car, Bus, Walk, Milestone } from "lucide-react";
import { ScrollFade } from "../../components/animations";
import FeatureCard from "../../components/FeatureCard";
import QualityCTA from "../../components/QualityCTA";

/**
 * Get Direction page
 *
 * - Responsive, accessible page that helps users get directions to the property.
 * - Maintains the same UI language, spacing and animations as other pages in the app.
 * - Provides a simple "Get directions" form that opens Google Maps in a new tab with origin + travel mode.
 *
 * Path: pages/get-direction/index.tsx
 */

export default function GetDirectionPage() {
  const DESTINATION = "12 Harbor Road, Lagos, Nigeria";

  const [origin, setOrigin] = useState("");
  const [mode, setMode] = useState<"driving" | "walking" | "transit">("driving");
  const [error, setError] = useState<string | null>(null);

  function openMaps() {
    if (!origin.trim()) {
      setError("Please enter a starting address or allow location access.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({
      api: "1",
      origin: origin,
      destination: DESTINATION,
      travelmode: mode,
    });
    const url = `https://www.google.com/maps/dir/?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function useMyLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        setOrigin(coords);
      },
      (err) => {
        setError("Unable to get your location. Please allow location access or enter address manually.");
      },
      { timeout: 8000 }
    );
  }

  return (
    <main className="min-h-screen bg-white font-inter">
      <div className="pt-28" />

      {/* HERO */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <ScrollFade>
            <div>
              <p className="text-sm text-primary font-medium mb-3">Get directions</p>
              <h1 className="text-3xl sm:text-4xl font-orelega">Find your way to Marathon</h1>
              <p className="mt-4 text-gray-600 max-w-lg">
                Use the form to open directions in Google Maps. Choose your travel mode or let us use your current location.
              </p>

              <div className="mt-6 flex gap-3">
                <Link href="/rooms" className="inline-block px-6 py-3 bg-primary text-white font-semibold hover:bg-[#a4182b] transition-colors">
                  Browse rooms
                </Link>
                <Link href="/contact" className="inline-block px-6 py-3 border border-gray-200 hover:bg-gray-50 transition-colors">
                  Contact us
                </Link>
              </div>
            </div>
          </ScrollFade>

          <ScrollFade>
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/hero-2.jpg" alt="Map hero" fill className="object-cover" />
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Main content: form + map + info */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column: form + tips */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Get directions to Marathon</h2>
              <p className="text-sm text-gray-500 mt-1">Destination: <span className="font-medium">12 Harbor Road, Lagos, Nigeria</span></p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Your starting address</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Enter address, e.g. 1 Awolowo Rd, Lagos or use 'My location'"
                    className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="w-full px-3 py-3 rounded-md border hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                    aria-label="Use my location"
                  >
                    <MapPin className="w-4 h-4" />
                    Use my location
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <div className="text-sm text-gray-700">Travel mode:</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMode("driving")}
                    className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${mode === "driving" ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
                    aria-pressed={mode === "driving"}
                  >
                    <Car className="w-4 h-4" /> Driving
                  </button>

                  <button
                    onClick={() => setMode("transit")}
                    className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${mode === "transit" ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
                    aria-pressed={mode === "transit"}
                  >
                    <Bus className="w-4 h-4" /> Transit
                  </button>

                  <button
                    onClick={() => setMode("walking")}
                    className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${mode === "walking" ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
                    aria-pressed={mode === "walking"}
                  >
                    <Milestone className="w-4 h-4" /> Walking
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={openMaps}
                  className="px-6 py-3 rounded-md bg-[#b61e2e] text-white font-semibold hover:bg-[#cf2732] transition-colors"
                >
                  Open in Google Maps
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DESTINATION)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-md border border-gray-200 text-sm flex items-center gap-2 hover:bg-gray-50"
                >
                  <MapPin className="w-4 h-4" /> View on map
                </a>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Driving</div>
                      <div className="text-xs text-gray-500">Secure parking available on-site</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md">
                      <Bus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Public transport</div>
                      <div className="text-xs text-gray-500">Nearest bus stop is 300m away</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md">
                      <Milestone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Walking</div>
                      <div className="text-xs text-gray-500">From the waterfront it's a pleasant 10–12 min walk</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-2">Tips</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>For fastest driving routes, select <strong>Driving</strong>.</li>
                  <li>For public transport times and schedules, choose <strong>Transit</strong>.</li>
                  <li>If using a rideshare app, use the precise address above for the drop-off point.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: map + contact */}
          <aside>
            <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-28">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Our address</div>
                  <div className="font-medium">12 Harbor Road, Lagos, Nigeria</div>
                </div>
              </div>

              <div className="mt-4 rounded-lg overflow-hidden">
                {/* responsive embedded map using Google Maps public embed (no api key) */}
                <div className="relative w-full h-44 sm:h-56">
                  <iframe
                    title="Marathon location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(DESTINATION)}&output=embed`}
                    loading="lazy"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div>Phone: <a href="tel:+2348123456789" className="text-primary underline">+234 812 345 6789</a></div>
                <div className="mt-1">Email: <a href="mailto:contact@marathon.example" className="text-primary underline">contact@marathon.example</a></div>
              </div>

              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-3 bg-primary text-white rounded-md"
                >
                  Open destination in Maps
                </a>
              </div>
            </div>
          </aside>
        </div>
        <section className="container mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FeatureCard title="Parking" src="/images/meetings-1.jpg" />
              <FeatureCard title="Accessibility" src="/images/services.png" />
            </div>
            </section>
      </section>

      <QualityCTA />

      {/* small footer CTA */}
      {/* <section className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold">Need extra help?</h4>
            <p className="text-gray-500">Call our front desk and we can guide you live.</p>
          </div>
          <a href="tel:+2348123456789" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold">Call front desk</a>
        </div>
      </section> */}
    </main>
  );
}
