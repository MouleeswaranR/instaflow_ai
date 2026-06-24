"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input defaultValue={session?.user?.name || ""} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={session?.user?.email || ""} disabled />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Post published</Label>
              <p className="text-xs text-muted-foreground">Get notified when a post is published</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Scheduled post reminders</Label>
              <p className="text-xs text-muted-foreground">Remind before scheduled posts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly analytics report</Label>
              <p className="text-xs text-muted-foreground">Receive weekly performance summary</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> API Configuration
          </CardTitle>
          <CardDescription>Configure your AI and integration API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Gemini API Key</Label>
            <Input type="password" placeholder="AIza..." />
          </div>
          <div className="space-y-2">
            <Label>OpenAI API Key (optional fallback)</Label>
            <Input type="password" placeholder="sk-..." />
          </div>
          <div className="space-y-2">
            <Label>Cloudinary Cloud Name</Label>
            <Input placeholder="your-cloud-name" />
          </div>
          <Button>Save API Keys</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Default theme</Label>
              <p className="text-xs text-muted-foreground">Theme for generated images</p>
            </div>
            <span className="text-sm font-medium capitalize">Dark</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Default font</Label>
              <p className="text-xs text-muted-foreground">Font for generated images</p>
            </div>
            <span className="text-sm font-medium">Modern (Inter)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
