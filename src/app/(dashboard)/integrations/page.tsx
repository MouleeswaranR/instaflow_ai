"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Code2, Check, ExternalLink, Loader2 } from "lucide-react";
import { InstagramIcon as Instagram, GithubIcon as Github } from "@/components/icons";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function IntegrationsPage() {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [isConnectingLeetcode, setIsConnectingLeetcode] = useState(false);
  const [isConnectingInstagram, setIsConnectingInstagram] = useState(false);
  const [isConnectedLeetcode, setIsConnectedLeetcode] = useState(false);
  const [isConnectedGithub, setIsConnectedGithub] = useState(false);
  const [isConnectedInstagram, setIsConnectedInstagram] = useState(false);
  const [instagramAccountId, setInstagramAccountId] = useState<string | null>(null);
  const [autoPostLc, setAutoPostLc] = useState(false);
  const [autoPostGh, setAutoPostGh] = useState(false);

  useEffect(() => {
    async function fetchIntegrations() {
      try {
        const [lcRes, ghRes, igRes] = await Promise.all([
          fetch("/api/integrations/leetcode"),
          fetch("/api/integrations/github"),
          fetch("/api/integrations/instagram")
        ]);
        
        if (lcRes.ok) {
          const data = await lcRes.json();
          if (data.integration) {
            setLeetcodeUsername(data.integration.username);
            setIsConnectedLeetcode(true);
            setAutoPostLc(data.integration.autoPost);
          }
        }

        if (ghRes.ok) {
          const ghData = await ghRes.json();
          setIsConnectedGithub(ghData.isConnected);
          setAutoPostGh(ghData.autoPost ?? false);
        }

        if (igRes.ok) {
          const igData = await igRes.json();
          if (igData.accounts && igData.accounts.length > 0) {
            setIsConnectedInstagram(true);
            setInstagramAccountId(igData.accounts[0].id);
          }
        }
      } catch (error) {
        // ignore
      }
    }
    fetchIntegrations();
  }, []);

  const handleToggleLcAutoPost = async (checked: boolean) => {
    setAutoPostLc(checked);
    try {
      const res = await fetch("/api/integrations/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoPost: checked }),
      });
      if (!res.ok) {
        setAutoPostLc(!checked);
        toast.error("Failed to update preferences");
      }
    } catch (e) {
      setAutoPostLc(!checked);
      toast.error("Failed to update preferences");
    }
  };

  const handleToggleGhAutoPost = async (checked: boolean) => {
    setAutoPostGh(checked);
    try {
      const res = await fetch("/api/integrations/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoPost: checked }),
      });
      if (!res.ok) {
        setAutoPostGh(!checked);
        toast.error("Failed to update preferences");
      }
    } catch (e) {
      setAutoPostGh(!checked);
      toast.error("Failed to update preferences");
    }
  };

  const handleConnectInstagram = async () => {
    setIsConnectingInstagram(true);
    try {
      const res = await fetch("/api/integrations/instagram", { method: "POST" });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast.error("Failed to initiate Instagram connection");
      }
    } catch (error) {
      toast.error("Failed to connect Instagram");
    } finally {
      setIsConnectingInstagram(false);
    }
  };

  const handleDisconnectInstagram = async () => {
    if (!instagramAccountId) return;
    try {
      const res = await fetch(`/api/integrations/instagram?accountId=${instagramAccountId}`, { method: "DELETE" });
      if (res.ok) {
        setIsConnectedInstagram(false);
        setInstagramAccountId(null);
        toast.success("Instagram disconnected");
      } else {
        toast.error("Failed to disconnect Instagram");
      }
    } catch {
      toast.error("Connection failed");
    }
  };

  const handleConnectGithub = () => {
    signIn("github", { callbackUrl: "/integrations" });
  };

  const handleDisconnectGithub = async () => {
    try {
      const res = await fetch("/api/integrations/github", { method: "DELETE" });
      if (res.ok) {
        setIsConnectedGithub(false);
        toast.success("GitHub disconnected");
      } else {
        toast.error("Failed to disconnect GitHub");
      }
    } catch {
      toast.error("Connection failed");
    }
  };

  const handleConnectLeetcode = async () => {
    if (!leetcodeUsername.trim()) {
      toast.error("Please enter your LeetCode username");
      return;
    }
    setIsConnectingLeetcode(true);
    try {
      const res = await fetch("/api/integrations/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: leetcodeUsername }),
      });
      if (res.ok) {
        setIsConnectedLeetcode(true);
        toast.success("LeetCode connected successfully!");
      } else {
        toast.error("Failed to connect LeetCode");
      }
    } catch {
      toast.error("Connection failed");
    } finally {
      setIsConnectingLeetcode(false);
    }
  };

  const handleDisconnectLeetcode = async () => {
    try {
      const res = await fetch("/api/integrations/leetcode", { method: "DELETE" });
      if (res.ok) {
        setIsConnectedLeetcode(false);
        setLeetcodeUsername("");
        setAutoPostLc(false);
        toast.success("LeetCode disconnected");
      } else {
        toast.error("Failed to disconnect LeetCode");
      }
    } catch {
      toast.error("Connection failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect your accounts to auto-generate content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instagram */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Instagram</CardTitle>
                <CardDescription>Connect to publish posts directly</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Badge variant={isConnectedInstagram ? "default" : "outline"} className="mb-3">
                {isConnectedInstagram ? "Connected" : "Not Connected"}
              </Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your Instagram Business account to publish posts and view analytics.
              </p>
              {isConnectedInstagram ? (
                <Button variant="destructive" className="gap-2" onClick={handleDisconnectInstagram}>
                  Disconnect
                </Button>
              ) : (
                <Button className="gap-2" onClick={handleConnectInstagram} disabled={isConnectingInstagram}>
                  {isConnectingInstagram ? <Loader2 className="h-4 w-4 animate-spin" /> : <Instagram className="h-4 w-4" />}
                  Connect Instagram
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Requires an Instagram Business or Creator account linked to a Facebook Page.
            </div>
          </CardContent>
        </Card>

        {/* GitHub */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-900" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-700">
                <Github className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>GitHub</CardTitle>
                <CardDescription>Auto-generate posts from your activity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Badge variant={isConnectedGithub ? "default" : "outline"} className="mb-3">
                {isConnectedGithub ? "Connected" : "Not Connected"}
              </Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Connect GitHub to turn commits, PRs, and releases into Instagram posts.
              </p>
              <Button 
                variant={isConnectedGithub ? "destructive" : "outline"} 
                className="gap-2" 
                onClick={isConnectedGithub ? handleDisconnectGithub : handleConnectGithub}
              >
                {isConnectedGithub ? "Disconnect" : <><Github className="h-4 w-4" /> Connect GitHub</>}
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-post-github" className="text-sm">Auto-post activity (Commits/PRs)</Label>
                <Switch id="auto-post-github" checked={autoPostGh} onCheckedChange={handleToggleGhAutoPost} disabled={!isConnectedGithub} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LeetCode */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>LeetCode</CardTitle>
                <CardDescription>Auto-post coding achievements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="leetcode-user">LeetCode Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="leetcode-user"
                    placeholder="your-leetcode-username"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                  />
                  <Button
                    onClick={isConnectedLeetcode ? handleDisconnectLeetcode : handleConnectLeetcode}
                    disabled={isConnectingLeetcode}
                    variant={isConnectedLeetcode ? "destructive" : "default"}
                    className="shrink-0 gap-2"
                  >
                    {isConnectingLeetcode ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isConnectedLeetcode ? (
                      "Disconnect"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-post-lc" className="text-sm">Auto-post daily solves</Label>
                <Switch id="auto-post-lc" checked={autoPostLc} onCheckedChange={handleToggleLcAutoPost} disabled={!isConnectedLeetcode} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-post-streak" className="text-sm">Post on streak milestones</Label>
                <Switch id="auto-post-streak" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
