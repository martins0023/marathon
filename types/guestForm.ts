// types/guestForm.ts
export type GuestDetailsValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string; // country code: "NG" | "US" | "GB"
  arrivalDate: string; // yyyy-mm-dd
  departureDate: string; // yyyy-mm-dd
  guests: number;
  rooms: number;
  specialRequests?: string;
};

export interface GuestDetailsFormProps {
  initialValues?: Partial<GuestDetailsValues>;
  onSubmit?: (values: GuestDetailsValues) => Promise<void> | void;
  className?: string;
  persistKey?: string | null;
  redirectTo?: string | null;
}

export const DEFAULTS: GuestDetailsValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "NG",
  arrivalDate: "",
  departureDate: "",
  guests: 1,
  rooms: 1,
  specialRequests: "",
};