import { getPrismaWithAuth } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

// Extend the NextAuth session interface to include a token
declare module "next-auth" {
  interface Session {
    token?: string;
    githubToken?: string;
    sub: string;
  }

  interface JWT {
    isToken?: string;
    githubToken?: string;
  }
}

export const AUTH_AA_PROVIDER_ID = "ping";

export interface UserProfile {
  uid: string;
  firstname: string;
  lastname: string;
  email: string;
}

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 Hours
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account, trigger, session }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
      }
      if (trigger === "update") {
        if (session?.githubToken) {
          const prisma = await getPrismaWithAuth();
          await prisma.mcp_keys
            .upsert({
              where: {
                user_id_service: {
                  user_id: Number(token.sub),
                  service: "github",
                },
              },
              update: {
                api_key: session.githubToken,
              },
              create: {
                user_id: Number(token.sub),
                service: "github",
                api_key: session.githubToken,
              },
            })
            .then(() => {
              token.githubToken = session.githubToken;
            });
        } else {
          const prisma = await getPrismaWithAuth();
          await prisma.mcp_keys
            .delete({
              where: {
                user_id_service: {
                  user_id: Number(token.sub),
                  service: "github",
                },
              },
            })
            .then(() => {
              token.githubToken = null;
            });
        }
      }

      return token;
    },
    async session({ session, token }) {
      try {
        if (!session || !token) {
          throw new Error("Session or token is undefined");
        }

        session.sub = token.sub as string;
        session.token = token.accessToken as string;

        if (token.githubToken) {
          session.githubToken = token.githubToken as string;
        }
      } catch (error) {
        console.error("Error setting session token:", error);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    {
      id: AUTH_AA_PROVIDER_ID,
      name: "American Airlines",
      type: "oauth",
      version: "2.0",
      wellKnown: process.env.AUTH_WELLKNOWN,
      idToken: true,
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      authorization: { params: { scope: "openid email profile" } },
      checks: ["pkce", "state"],
      httpOptions: {
        headers: {
          "User-Agent": "AutopilotUI",
        },
      },
      profile: (profile: UserProfile) => {
        return {
          id: profile.uid,
          name: `${profile.firstname} ${profile.lastname}`,
          email: profile.email,
        };
      },
    },
  ],
};
