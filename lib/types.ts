// lib/types.ts

export type RoomImage = {
  url: string;
  public_id: string;
};

export type RoomNumber = {
  _id?: string;
  number?: string;
  unavailableDates?: string[]; // dates ISO strings
};

export type Room = {
  _id: string;
  room_type: string; // enum values like 'room'|'dining' etc.
  title: string;
  price: number[]; // backend uses [Number]
  max_people: number;
  desc: string;
  amenities: { icon?: string; name: string }[];
  images?: RoomImage[];
  room_numbers?: RoomNumber[];
  createdAt?: string;
  updatedAt?: string;
};
