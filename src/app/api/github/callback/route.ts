import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    throw new Error("Authentication failed. Missing code or State");
  }

  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GH_CLIENT_ID,
          client_secret: process.env.GH_CLIENT_SECRET,
          code: code,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/github/callback`,
        }),
      },
    );

    const tokenData = await tokenRes.json();

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { type: "github-oauth-success", token: "${tokenData.access_token}"},
              "${process.env.NEXTAUTH_URL}"
            );
            </script>
          </body>
        </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
  } catch {
    throw new Error();
  }
}
