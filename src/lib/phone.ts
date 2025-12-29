export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/\s|-/g, '');
  if (!cleaned) return null;

  const e164 = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;

  // Basic E.164-style validation: + then 8–15 digits
  if (!/^\+[1-9]\d{7,14}$/.test(e164)) {
    return null;
  }

  return e164;
}


