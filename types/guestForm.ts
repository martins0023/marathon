// types/guestForm.ts
export interface GuestDetailsValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  guests: number;
  rooms: number;
  specialRequests?: string;
  totalPrice?: number;
}

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