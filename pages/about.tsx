// pages/about.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollFade, ScrollStagger } from "../components/animations"
import FeatureCard from "../components/FeatureCard";
import QualityCTA from "../components/QualityCTA";
import { Linkedin, Mail } from "lucide-react";

/**
 * About page for Marathon
 *
 * - Builds on the existing layout, animations and UI language used across the app.
 * - Mobile-first, responsive and accessible.
 * - Uses existing components: FeatureCard, ScrollFade, ScrollStagger, QualityCTA.
 *
 * Drop this file in `pages/about.tsx`.
 */

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const values = [
    { title: "Our Mission", desc: "To provide warm, reliable and stylish stays that feel like home — every time." },
    { title: "Our Vision", desc: "Be the most trusted hospitality brand for modern travellers across the region." },
    { title: "Our Promise", desc: "Thoughtful service, great locations and consistent quality — always." },
  ];

  const team = [
    { name: "Adaobi Okoye", role: "Founder & CEO", image: "/images/team-adaobi.jpg", email: "adaobi@marathon.example" },
    { name: "Kola Adebayo", role: "Head of Operations", image: "/images/team-kola.jpg", email: "kola@marathon.example" },
    { name: "Maya Thomas", role: "Chief Designer", image: "/images/team-maya.jpg", email: "maya@marathon.example" },
  ];

  const faqs = [
    { q: "How do I make a booking?", a: "Select a room, choose your dates, enter guest details on the booking form, and complete payment through our secure checkout." },
    { q: "Can I cancel or modify my reservation?", a: "Yes — cancellations and modifications are available depending on the rate type. Check your booking confirmation for the cancellation policy." },
    { q: "Do you offer corporate or group rates?", a: "Yes — we support corporate accounts and group bookings. Contact our sales team for custom pricing and packages." },
  ];

  const stats = [
    { label: "Properties", value: 24 },
    { label: "Cities", value: 8 },
    { label: "Years in Service", value: 6 },
    { label: "Happy Guests", value: 12400 },
  ];

  return (
    <main className="min-h-screen bg-white font-inter">
      {/* top offset so fixed navbar does not cover the hero */}
      <div className="pt-28" />

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-6 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <ScrollFade offsetY={24} start={0.06} end={0.36}>
              <div className="max-w-xl">
                <p className="text-sm text-primary font-medium mb-3">About Marathon</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-orelega leading-tight">
                  Hospitality with heart — thoughtful stays for every traveller
                </h1>
                <p className="mt-6 text-gray-600">
                  We design comfortable, reliable and memorable stays across well-located properties.
                  From business visitors to adventurous holidaymakers, we craft experiences that feel like home.
                </p>

                <div className="mt-8 flex gap-3 flex-wrap">
                  <Link href="/contact" className="inline-block px-6 py-3 bg-primary text-white font-semibold hover:bg-[#a4182b] transition-colors">
                    Contact Sales
                  </Link>
                  <Link href="/rooms" className="inline-block px-6 py-3 border border-gray-200 hover:bg-gray-200 transition-colors">
                    Browse Rooms
                  </Link>
                </div>
              </div>
            </ScrollFade>

            <ScrollFade offsetY={28} start={0.08} end={0.38}>
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-md">
                <Image src="/images/conferences.png" alt="About Marathon" fill className="object-cover" />
              </div>
            </ScrollFade>
          </div>
        </div>
      </section>

      {/* MISSION & VALUES */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <ScrollFade>
            <div>
              <h2 className="text-2xl font-bold font-orelega">Who we are</h2>
              <p className="mt-3 text-gray-600 max-w-md">
                Marathon is a hospitality brand built around consistency and local authenticity.
                We combine modern design with warm service, making every stay relaxing and dependable.
              </p>
            </div>
          </ScrollFade>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <ScrollFade key={v.title} offsetY={18} start={0.12 + i * 0.02} end={0.48} delay={i * 0.03}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h3 className="font-semibold text-lg">{v.title}</h3>
                  <p className="mt-2 text-gray-600">{v.desc}</p>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE / VALUES CARDS */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h3 className="text-xl font-semibold mb-4">What we focus on</h3>
          <ScrollFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard title="Comfort" src="/images/hero-2.jpg" />
            <FeatureCard title="Local Experiences" src="/images/meetings-1.jpg" />
            <FeatureCard title="Business Ready" src="/images/dining-3.jpg" />
            <FeatureCard title="Sustainability" src="/images/meetings-1.jpg" />
          </ScrollFade>
        </div>
      </section>

      {/* TEAM */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold font-orelega">Our team</h3>
            <p className="text-gray-500 mt-1">A small, passionate team delivering consistent hospitality.</p>
          </div>
          <Link href="/careers" className="hidden sm:inline-block text-primary font-semibold hover:underline">See openings</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <ScrollFade key={member.name}>
              <div className="bg-white rounded-2xl p-5 shadow-sm flex gap-4 items-center">
                <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-primary transition-colors" aria-label={`Email ${member.name}`}>
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label={`LinkedIn ${member.name}`}>
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-to-r from-white to-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <ScrollFade key={s.label}>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary">{s.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Frequently asked questions</h3>
          <p className="text-gray-600 mb-6">If you don't find what you're looking for, contact our support team.</p>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div key={f.q} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-${idx}`}
                >
                  <span className="font-medium">{f.q}</span>
                  <span className="text-gray-500">{openFaq === idx ? "−" : "+"}</span>
                </button>

                <div
                  id={`faq-${idx}`}
                  className={`px-4 pb-4 transition-all ${openFaq === idx ? "block" : "hidden"}`}
                >
                  <p className="text-gray-600">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality CTA (re-uses existing component) */}
      <QualityCTA />
    </main>
  );
}
