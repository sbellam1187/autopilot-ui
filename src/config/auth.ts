import { NextAuthOptions } from "next-auth";

// Extend the NextAuth session interface to include a token
declare module "next-auth" {
  interface Session {
    token?: string;
    githubToken?: string;
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
        if (token.githubToken && account.access_token) {
          token.githubToken = account.access_token;
        }
      }

      if (trigger === "update") {
        if (session?.githubToken) {
          token.githubToken = session.githubToken;
        } else {
          token.githubToken = null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      try {
        if (!session || !token) {
          throw new Error("Session or token is undefined");
        }

        session.token = token.idToken as string;

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
