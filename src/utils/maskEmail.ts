/* eslint-disable @typescript-eslint/no-explicit-any */
export default function maskEmail(email: any) {
  if (!email || typeof email !== "string") return "";

  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  const maskedLocal = localPart.slice(0, 5) + "*".repeat(localPart.length - 3);
  return `${maskedLocal}@${domain}`;
}
