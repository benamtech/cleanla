export function generateClaimCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}
