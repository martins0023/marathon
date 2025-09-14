// components/LoadingState.tsx
"use client";

import React from "react";

export default function LoadingState() {
  return (
    <main className="min-h-screen bg-white font-inter pt-28">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />
      </div>
    </main>
  );
}