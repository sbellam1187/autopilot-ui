import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");

  if (!state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");

  githubAuthUrl.searchParams.append(
    "client_id",
    process.env.GH_CLIENT_ID || "",
  );
  githubAuthUrl.searchParams.append(
    "redirect_uri",
    `${process.env.NEXTAUTH_URL}/api/github/callback`,
  );
  githubAuthUrl.searchParams.append("state", state);
  githubAuthUrl.searchParams.append("scope", "read:user user:email repo");

  return redirect(githubAuthUrl.toString());
}
