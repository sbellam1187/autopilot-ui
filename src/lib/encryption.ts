import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

//TODO: we need to create some integraty for environment variables

export function encryptToken(token: string, secret_key: string): string {
  const key = Buffer.from(secret_key ?? "", "hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(Buffer.from("github-token", "utf8"));

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}

export function decryptToken(
  encryptedData: string,
  secret_key: string,
): string {
  const parts = encryptedData.split(":");

  const key = Buffer.from(secret_key ?? "", "hex");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from("github-token", "utf8"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
