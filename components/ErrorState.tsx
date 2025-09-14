// components/ErrorState.tsx
"use client";

import React from "react";

interface ErrorStateProps {
  error: any;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <main className="min-h-screen bg-white font-inter pt-28">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-lg p-4">
          <strong>Error loading room:</strong> {error?.message ?? "Unknown error"}
        </div>
      </div>
    </main>
  );
}