// utils/formValidation.ts
import { GuestDetailsValues } from "../types/guestForm";
import { validatePhoneForCountry } from "./phoneValidation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export interface ValidationErrors {
  [key: string]: string;
}

export function validateGuestForm(values: GuestDetailsValues): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  }
  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  // Email validation
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  // Phone validation
  const phoneCheck = validatePhoneForCountry(values.country, values.phone);
  if (!phoneCheck.ok) {
    errors.phone = phoneCheck.message || "Invalid phone number.";
  }

  // Date validation
  if (!values.arrivalDate) {
    errors.arrivalDate = "Arrival date is required.";
  }
  if (!values.departureDate) {
    errors.departureDate = "Departure date is required.";
  }

  if (values.arrivalDate && values.departureDate) {
    const arrival = new Date(values.arrivalDate);
    const departure = new Date(values.departureDate);
    
    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
      if (!errors.arrivalDate) errors.arrivalDate = "Invalid date.";
      if (!errors.departureDate) errors.departureDate = "Invalid date.";
    } else if (departure <= arrival) {
      errors.departureDate = "Departure must be after arrival.";
    }
  }

  // Number validation
  if (!Number.isInteger(values.guests) || values.guests < 1) {
    errors.guests = "Please enter at least 1 guest.";
  }
  if (!Number.isInteger(values.rooms) || values.rooms < 1) {
    errors.rooms = "Please enter at least 1 room.";
  }

  return errors;
}