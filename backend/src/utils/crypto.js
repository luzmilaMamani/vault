import crypto from "crypto";

const ALGO = "aes-256-gcm";

function getKey() {
  const raw = process.env.ENCRYPTION_KEY || "";
  // try base64, then utf8
  let key = null;
  try {
    key = Buffer.from(raw, "base64");
  } catch (e) {
    key = null;
  }
  if (!key || key.length !== 32) key = Buffer.from(raw, "utf8");
  if (key.length !== 32)
    throw new Error("ENCRYPTION_KEY must be 32 bytes (base64 or raw)");
  return key;
}

export function encrypt(text) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([
    cipher.update(String(text), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export function decrypt(payload) {
  const key = getKey();
  const data = Buffer.from(payload, "base64");
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const cipherText = data.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return out.toString("utf8");
}
