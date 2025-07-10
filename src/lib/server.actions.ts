"use server";

import { decryptToken, encryptToken } from "./encryption";
import { getPrismaWithAuth } from "./prisma";

export const getGithubKey = async (aaId: number): Promise<string | null> => {
  const prisma = await getPrismaWithAuth();
  const result = await prisma.mcp_keys.findUnique({
    select: {
      api_key: true,
    },
    where: {
      user_id_service: {
        user_id: aaId,
        service: "github",
      },
    },
  });

  if (result) {
    return result.api_key;
  }

  return null;
};

export async function encryptTokenAction(token: string): Promise<string> {
  const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

  if (SECRET_KEY === undefined)
    throw new Error("key environment variable undefined");

  try {
    return encryptToken(token, SECRET_KEY);
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to decrypt token");
  }
}

export async function decryptTokenAction(token: string): Promise<string> {
  const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

  if (SECRET_KEY === undefined)
    throw new Error("key environment variable undefined");

  try {
    return decryptToken(token, SECRET_KEY);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt token");
  }
}
