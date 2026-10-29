// Shared by browser and server; no secrets or server-only dependencies.
export function normalizePhone(value: string): string | null {
  if (value.length > 40 || !/^\+?[\d\s()\-]+$/.test(value.trim())) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) digits = digits.slice(1);
  if (!/^9\d{9}$/.test(digits)) return null;
  // Reject placeholders without rejecting ordinary names or free-form descriptions.
  if (/^(\d)\1{6}$/.test(digits.slice(3))) return null;
  return "+7" + digits;
}

const unsafeControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/;
export function validName(value: string): boolean {
  return value.length >= 2 && value.length <= 80 &&
    /^[\p{L}\p{M} .’'\-]+$/u.test(value) && /\p{L}/u.test(value) && !unsafeControls.test(value);
}
export function validDescription(value: string): boolean {
  return value.length >= 5 && value.length <= 2000 &&
    /[\p{L}\p{N}]/u.test(value) && !unsafeControls.test(value) && !/^(.)\1{4,}$/u.test(value);
}
