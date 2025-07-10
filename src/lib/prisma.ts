import { PrismaClient } from "../../generated/prisma";
import { buildDatabaseURL } from "./azure-auth";

declare global {
  var __prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

export const getPrismaWithAuth = async (): Promise<PrismaClient> => {
  try {
    const databaseUrl = await buildDatabaseURL();

    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  } catch (error) {
    console.error("Error creating authenticated Prisma Client", error);
    return prisma;
  }
};

export default prisma;
