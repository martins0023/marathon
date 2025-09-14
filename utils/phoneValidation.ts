// utils/phoneValidation.ts
interface PhoneValidationResult {
  ok: boolean;
  normalized?: string;
  message?: string;
}

interface CountryRule {
  min: number;
  max: number;
  code: string;
}

const PHONE_RULES: Record<string, CountryRule> = {
  NG: { min: 10, max: 13, code: "234" },
  US: { min: 10, max: 11, code: "1" },
  GB: { min: 10, max: 12, code: "44" },
};

export function validatePhoneForCountry(
  country: string | undefined, 
  phoneRaw: string | undefined
): PhoneValidationResult {
  if (!phoneRaw || !phoneRaw.trim()) {
    return { ok: true, normalized: "" };
  }

  const digits = phoneRaw.replace(/\D+/g, "");
  const rule = PHONE_RULES[country ?? "NG"] ?? PHONE_RULES["NG"];
  
  if (digits.length < rule.min || digits.length > rule.max) {
    return { 
      ok: false, 
      message: `Phone number seems invalid for ${country || "selected country"}.` 
    };
  }

  if (digits.startsWith(rule.code) || digits.length === rule.min) {
    const normalized = "+" + (digits.startsWith(rule.code) ? digits : rule.code + digits);
    return { ok: true, normalized };
  }
  
  return { ok: true, normalized: "+" + digits };
}