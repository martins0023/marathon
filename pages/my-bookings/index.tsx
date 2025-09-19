
// pages/my-bookings/index.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import QualityCTA from "../../components/QualityCTA";
import { ScrollFade } from "../../components/animations";

/**
 * My Bookings Page
 * - Allows users to search for, view, and manage their bookings.
 * - Adheres to the existing UI language and a mobile-first, responsive design.
 * - Designed to be backend-ready with clear state management for searching.
 */

interface BookingDetails {
  id: string;
  name: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  price: string;
  imageUrl: string;
  status: 'confirmed' | 'pending' | 'canceled';
}

export default function MyBookingsPage() {
  const [query, setQuery] = useState("");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This is a placeholder for a real API call
  const fetchBooking = async (searchQuery: string): Promise<BookingDetails | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simulate backend response
    const dummyBooking: BookingDetails = {
      id: "BK-12345",
      name: "John Doe",
      roomName: "Luxury Suite",
      checkIn: "2025-10-01",
      checkOut: "2025-10-05",
      guests: 2,
      price: "₦400,000",
      imageUrl: "/images/bedroom.png",
      status: 'confirmed',
    };
    
    // Simple logic to simulate a successful or failed search
    if (searchQuery.trim().toLowerCase() === "bk-12345" || searchQuery.trim().toLowerCase() === "john doe" || searchQuery.trim().toLowerCase() === "luxury suite") {
      return dummyBooking;
    } else {
      return null;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a booking ID, name, or email.");
      setBooking(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setBooking(null);

    try {
      const result = await fetchBooking(query);
      if (result) {
        setBooking(result);
      } else {
        setError("Booking not found. Please check your details and try again.");
      }
    } catch (err) {
      setError("An error occurred while searching for your booking.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-inter pt-28">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <ScrollFade>
          <p className="text-sm text-primary font-medium mb-2">My Bookings</p>
          <h1 className="text-3xl sm:text-4xl font-orelega">Manage your reservation</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            View, change, or cancel your reservation by entering your booking details below.
          </p>
        </ScrollFade>
      </section>

      

      {/* Search Form */}
      <section className="container mx-auto px-6 pb-12">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <label htmlFor="booking-search" className="sr-only">Search for booking</label>
          <input
            id="booking-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Booking ID, Name, or Email"
            className="flex-1 w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white font-semibold hover:bg-[#a4182b] transition-colors rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      {/* Booking Details Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-gray-50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
              <p className="mt-4 text-gray-500">Fetching your booking details...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center text-red-500">
              <p className="font-semibold mb-2">Oops!</p>
              <p>{error}</p>
            </div>
          )}

          {booking && !isLoading && !error && (
            <ScrollFade className="w-full">
              <h2 className="text-xl font-bold font-orelega mb-6">Booking Details</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 relative h-48 md:h-auto rounded-lg overflow-hidden shadow-md">
                  <Image src={booking.imageUrl} alt={booking.roomName} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Booking ID: {booking.id}</p>
                  <h3 className="text-2xl font-bold font-orelega mt-1">{booking.roomName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
                    <div>
                      <p className="font-semibold">Guest Name:</p>
                      <p>{booking.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Price:</p>
                      <p>{booking.price}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Check-in:</p>
                      <p>{booking.checkIn}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Check-out:</p>
                      <p>{booking.checkOut}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Guests:</p>
                      <p>{booking.guests}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Status:</p>
                      <p className={`capitalize ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{booking.status}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button className="px-6 py-3 border border-gray-200 hover:bg-gray-100 transition-colors font-semibold">
                      Change Reservation
                    </button>
                    <button className="px-6 py-3 bg-primary text-white font-semibold hover:bg-primary transition-colors">
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              </div>
            </ScrollFade>
          )}

          {!booking && !isLoading && !error && (
            <div className="text-center text-gray-500">
              <p>Enter your details above to find your booking.</p>
            </div>
          )}
        </div>
      </section>

      {/* Need Assistance Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div>
            <h5 className="font-medium">Need assistance?</h5>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              If you are having trouble finding your reservation or need further assistance, please contact our support team.
            </p>
          </div>
          <Link href="/contact" className="inline-block px-6 py-3 border border-gray-200 hover:bg-gray-50 transition-colors rounded-md">
            Contact us
          </Link>
        </div>
      </section>

      <QualityCTA />
    </main>
  );
}
