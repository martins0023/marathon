// components/form/FormActions.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { TimerReset } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  successMsg: string | null;
  onReset: () => void;
}

export default function FormActions({ loading, successMsg, onReset }: FormActionsProps) {
  return (
    <>
      {/* Action buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center px-6 py-3 text-sm text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-primary hover:bg-[#cf2732]"
            } transition-colors`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Preparing booking...
              </>
            ) : (
              "Continue to booking"
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-3 border flex flex-row gap-2 items-center border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={loading}
          >
            <TimerReset className="w-5 h-5 text-gray-800" />
            Reset
          </button>
        </div>

        <p className="text-xs text-gray-500">
          By continuing you agree to our <a className="underline" href="/terms">terms & conditions</a>.
        </p>
      </div>

      {/* Success message */}
      <div aria-live="polite" className="relative">
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={successMsg ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.28 }}
          className="absolute right-0 top-4"
        >
          {successMsg && (
            <div className="bg-green-50 text-green-800 border border-green-100 px-4 py-2 rounded-md shadow-sm text-sm">
              {successMsg}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}