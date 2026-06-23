import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_KEY ?? "admin123";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSignature(payload: string) {
  return crypto
    .createHmac("sha256", ADMIN_PASSWORD)
    .update(payload)
    .digest("base64url");
}

function verifySignature(payload: string, signature: string) {
  const expected = createSignature(payload);
  try {
    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expected, "utf8");
    return (
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    );
  } catch {
    return false;
  }
}

export function validateAdminPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

export function createAdminSessionToken() {
  const expires = Date.now() + SESSION_DURATION_MS;
  const payload = `exp=${expires}`;
  const signature = createSignature(payload);
  return `${encodeBase64Url(payload)}.${signature}`;
}

export function verifyAdminSessionToken(cookieValue?: string) {
  if (!cookieValue) return false;
  const [payloadBase64, signature] = cookieValue.split(".");
  if (!payloadBase64 || !signature) return false;

  let payload: string;
  try {
    payload = decodeBase64Url(payloadBase64);
  } catch {
    return false;
  }

  if (!verifySignature(payload, signature)) return false;

  const match = payload.match(/^exp=(\d+)$/);
  if (!match) return false;

  return Number(match[1]) > Date.now();
}
