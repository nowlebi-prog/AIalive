/** Strips everything but digits: "010-1234-5678" -> "01012345678" */
export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

/** Loose Korean mobile number check (010/011/016/017/018/019 + 7-8 digits). */
export function isValidKoreanPhone(input: string): boolean {
  const digits = normalizePhone(input);
  return /^01[016789]\d{7,8}$/.test(digits);
}
