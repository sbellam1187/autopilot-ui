import { NextAuthOptions } from "next-auth";

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
