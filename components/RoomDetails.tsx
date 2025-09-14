// components/RoomDetails.tsx
"use client";

import React from "react";
import { ScrollFade } from "./animations";
import { MappedRoom } from "../lib/roomMapper"; 

interface RoomDetailsProps {
  room: MappedRoom;
}

export default function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <div className="space-y-6">
      <ScrollFade offsetY={18} start={0.1} end={0.45}>
        <div>
          <h1 className="text-3xl lg:text-4xl font-orelega">{room.title}</h1>
        </div>
      </ScrollFade>

      <ScrollFade offsetY={20} start={0.14} end={0.5}>
        <div className="text-gray-700">{room.description}</div>
      </ScrollFade>

      <ScrollFade offsetY={20} start={0.16} end={0.54}>
        <div>
          <h4 className="font-semibold mt-4 mb-3">Amenities</h4>
          <ul className="space-y-3 text-gray-600">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollFade>
    </div>
  );
}