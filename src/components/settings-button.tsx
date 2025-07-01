"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { GitHubLogo } from "@/components/ui/svg-logos";
import { useSession } from "next-auth/react";
import GitHubOAuth from "./github-button";
import { useState } from "react";

export default function SettingsButton() {
  const { data: session } = useSession();
  const [githubToken, setGithubToken] = useState<string | null>(
    session?.githubToken || null,
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full " variant={"outline"}>
          <Settings className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md md:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="flex gap-2 items-center">
            <Settings className="w-4 h-4" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Add our integrations or your own MCP Server(s) below.
          </SheetDescription>
        </SheetHeader>
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>{" "}
          </CardHeader>
          <CardContent>
            <Card>
              <CardHeader className="flex flex-row items-center ">
                <div className="flex items-center justify-center">
                  <span className="relative flex h-2 w-2 bottom-3 left-9">
                    {githubToken ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </>
                    ) : (
                      <>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                      </>
                    )}
                  </span>
                  <div className="bg-primary-foreground p-3 rounded-lg mr-2">
                    <GitHubLogo />
                  </div>
                </div>
                <div className="mr-4">
                  <CardTitle>GitHub</CardTitle>
                  <CardDescription>
                    Connect your GitHub account.
                  </CardDescription>
                </div>
                <GitHubOAuth setGitHubTokenAction={setGithubToken} />
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
