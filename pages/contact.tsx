// pages/contact.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { ScrollFade, ScrollStagger } from "../components/animations";
import FeatureCard from "../components/FeatureCard";
import QualityCTA from "../components/QualityCTA";

/**
 * Contact page
 *
 * - Builds on existing app layout/components (ScrollFade, FeatureCard, QualityCTA)
 * - Responsive: mobile-first, stacks on small screens and becomes multi-column on larger viewports
 * - Contact form with client-side validation, mock submit (shows loading + success)
 * - Contact info cards and a responsive image/map placeholder
 *
 * Drop this file into `pages/contact.tsx`.
 */

type FormState = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function Contact() {
  return (
    <main className="min-h-screen bg-white font-inter">
      {/* offset for fixed navbar */}
      <div className="pt-28" />

      {/* Hero */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <ScrollFade>
            <div className="max-w-xl">
              <p className="text-sm text-primary font-medium mb-3">Get in touch</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-orelega leading-tight">
                We’d love to hear from you
              </h1>
              <p className="mt-6 text-gray-600">
                Whether you have a question about booking, partnerships or anything else —
                our team is ready to help. Use the form or the contact options on this page.
              </p>

              <div className="mt-8 flex gap-3 flex-wrap">
                <Link
                  href="/rooms"
                  className="inline-block px-6 py-3 bg-primary text-white font-semibold hover:bg-[#a4182b] transition-colors"
                >
                  Book a room
                </Link>
                <a
                  href="mailto:contact@marathon.example"
                  className="inline-block px-6 py-3 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Email us
                </a>
              </div>
            </div>
          </ScrollFade>

          <ScrollFade>
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/meetings-2.jpg" alt="Contact Marathon" fill className="object-cover" />
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Contact grid: form + info */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: contact form (spans 2 columns on lg) */}
          <div className="lg:col-span-2">
            <ScrollFade>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-2">Send us a message</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill the form and our team will get back to you within 24 hours.
                </p>

                <ContactForm />
              </div>
            </ScrollFade>

            {/* quick FAQs / support links */}
            <ScrollFade className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
                <FeatureCard title="Booking help" src="/images/dining-3.jpg" />
                <FeatureCard title="Group & corporate" src="/images/hero-1.png" />
              
            </ScrollFade>
          </div>

          {/* Right: contact details & map */}
          <div>
            <ScrollFade>
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="text-xl font-semibold">Contact details</h3>

                <div className="space-y-4">
                  <ContactCard
                    title="Email"
                    subtitle="General enquiries"
                    value="contact@marathon.example"
                    icon={<Mail className="w-5 h-5 text-primary" />}
                    href="mailto:contact@marathon.example"
                  />

                  <ContactCard
                    title="Phone"
                    subtitle="Call us"
                    value="+234 812 345 6789"
                    icon={<Phone className="w-5 h-5 text-primary" />}
                    href="tel:+2348123456789"
                  />

                  <ContactCard
                    title="Address"
                    subtitle="Visit us"
                    value="12 Harbor Road, Lagos, Nigeria"
                    icon={<MapPin className="w-5 h-5 text-primary" />}
                    href="https://maps.google.com"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Office hours: Mon — Fri, 9:00 — 18:00</p>
                </div>

                <div className="mt-4 rounded-md overflow-hidden">
                  {/* responsive map / image placeholder */}
                  <div className="relative w-full h-40 sm:h-52 md:h-64">
                    <Image src="/images/map-placeholder.jpeg" alt="Map" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </ScrollFade>
          </div>
        </div>
      </section>

      {/* small CTA */}
      <QualityCTA />

      {/* footer mini CTA */}
      {/* <section className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold">Need help now?</h4>
            <p className="text-gray-500">Call our support line for urgent requests.</p>
          </div>
          <a href="tel:+2348123456789" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold">Call support</a>
        </div>
      </section> */}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponents used in this page                                             */
/* -------------------------------------------------------------------------- */

function ContactCard({
  title,
  subtitle,
  value,
  icon,
  href,
}: {
  title: string;
  subtitle?: string;
  value: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{subtitle}</div>
        <a href={href} className="text-sm font-medium hover:underline block">
          {value}
        </a>
        <div className="text-xs text-gray-400 mt-1">{title}</div>
      </div>
    </div>
  );
}

/* -------------------------- Contact form component ------------------------- */

function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setSuccess(null);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!state.name.trim()) e.name = "Name is required.";
    if (!state.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(state.email)) e.email = "Enter a valid email.";
    if (!state.subject.trim()) e.subject = "Subject is required.";
    if (!state.message.trim() || state.message.trim().length < 8) e.message = "Message must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      // mock network call
      await new Promise((res) => setTimeout(res, 900));

      setSuccess("Thanks — we received your message and will respond shortly.");
      setState(initialState);
    } catch (err) {
      setErrors({ name: "Failed to send message. Try again." });
    } finally {
      setLoading(false);
      // hide success after a while
      setTimeout(() => setSuccess(null), 5000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Name</label>
          <input
            value={state.name}
            onChange={(e) => update("name", e.target.value)}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none ${errors.name ? "border-red-400" : "border-gray-200"}`}
            placeholder="Your full name"
            disabled={loading}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-2 block">Email</label>
          <input
            value={state.email}
            onChange={(e) => update("email", e.target.value)}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none ${errors.email ? "border-red-400" : "border-gray-200"}`}
            placeholder="you@example.com"
            disabled={loading}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-2 block">Phone (optional)</label>
          <input
            value={state.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full border rounded-md px-4 py-3 focus:outline-none border-gray-200"
            placeholder="+234 812 345 6789"
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-2 block">Subject</label>
          <input
            value={state.subject}
            onChange={(e) => update("subject", e.target.value)}
            className={`w-full border rounded-md px-4 py-3 focus:outline-none ${errors.subject ? "border-red-400" : "border-gray-200"}`}
            placeholder="What is this about?"
            disabled={loading}
          />
          {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-700 mb-2 block">Message</label>
        <textarea
          value={state.message}
          onChange={(e) => update("message", e.target.value)}
          rows={6}
          className={`w-full border rounded-md px-4 py-3 focus:outline-none ${errors.message ? "border-red-400" : "border-gray-200"}`}
          placeholder="Tell us a bit more..."
          disabled={loading}
        />
        {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          className={`inline-flex items-center px-6 py-3 text-white font-semibold ${loading ? "bg-gray-400" : "bg-primary hover:bg-[#cf2732]"} transition-colors`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>

        <div className="text-sm text-gray-500">
          Or email us at{" "}
          <a href="mailto:contact@marathon.example" className="text-primary underline">
            contact@marathon.example
          </a>
        </div>
      </div>

      <div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={success ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.28 }}
          className="mt-2"
        >
          {success && <div className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-md">{success}</div>}
        </motion.div>
      </div>
    </form>
  );
}
