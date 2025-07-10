"use client";

import { useSession } from "next-auth/react";
import { SetStateAction, useEffect, useState, Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { encryptTokenAction } from "@/lib/server.actions";

interface GitHubOAuthProps {
  setGitHubTokenAction: Dispatch<SetStateAction<string | null>>;
}

export default function GitHubOAuth({
  setGitHubTokenAction: setGithubTokenAction,
}: GitHubOAuthProps) {
  const { data: session, update } = useSession();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const isConnected = !!session?.githubToken;

  useEffect(() => {
    if (session?.githubToken && !authToken) {
      setAuthToken(session.githubToken);
      setGithubTokenAction?.(session.githubToken);
    }
  }, [session?.githubToken, authToken, setGithubTokenAction]);

  const connectGitHub = () => {
    setIsConnecting(true);

    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("github_oauth_state", state);

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `/api/github/authorize?state=${state}`,
      "github-oauth",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "github-oauth-success" && event.data?.token) {
        popup?.close();
        const token = await encryptTokenAction(event.data.token);
        setAuthToken(token);
        setGithubTokenAction?.(token);

        await update({ githubToken: token }).then(() => {
          toast.success("Successfully connected GitHub account!");
        });

        setIsConnecting(false);
      }
    };

    window.addEventListener("message", handleMessage);

    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);
        window.removeEventListener("message", handleMessage);
        setIsConnecting(false);
      }
    }, 500);
  };

  const disconnectGitHub = async () => {
    setAuthToken(null);
    await update({ githubToken: null }).then(() => {
      toast.error("Disconnected your GitHub account");
    });
    setGithubTokenAction(null);
  };

  return (
    <>
      {isConnected ? (
        <Button onClick={disconnectGitHub} variant={"destructive"}>
          {isConnecting ? <Loader2 className="animate-spin" /> : "Disconnect"}
        </Button>
      ) : (
        <Button onClick={connectGitHub}>
          {" "}
          {isConnecting ? <Loader2 className="animate-spin" /> : "Connect"}
        </Button>
      )}
    </>
  );
}
