"use client";

import { useState } from "react";
import { useCreatePostStore } from "@/store/create-post-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, Calendar, Clock, Loader2, Check } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons";
import { toast } from "sonner";

export function PublishPanel() {
  const store = useCreatePostStore();
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First save the post
      const saveRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.title,
          description: store.description,
          category: store.category,
          achievementType: store.achievementType,
          notes: store.notes,
          theme: store.theme,
          font: store.font,
          layout: store.layout,
          captions: store.captions,
          hashtags: store.hashtags,
          carouselSlides: store.carouselSlides,
          musicRecommendations: store.musicRecommendations,
          selectedCaptionType: store.selectedCaptionType,
          selectedHashtagType: store.selectedHashtagType,
          images: store.images,
          selectedImageId: store.selectedImageId,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.error || "Failed to save post");
      }

      store.setPostId(saveData.id);

      if (publishMode === "schedule" && scheduleDate && scheduleTime) {
        // Schedule the post
        await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: saveData.id,
            scheduledAt: `${scheduleDate}T${scheduleTime}:00`,
            timezone,
            frequency: "ONCE",
          }),
        });
        toast.success("Post scheduled successfully!");
      } else {
        // Publish now
        const pubRes = await fetch(`/api/posts/${saveData.id}/publish`, {
          method: "POST",
        });

        if (!pubRes.ok) {
          const errData = await pubRes.json();
          throw new Error(errData.error || "Publishing failed");
        }

        toast.success("Post published to Instagram!");
      }

      setIsPublished(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isPublished) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {publishMode === "schedule" ? "Post Scheduled!" : "Post Published!"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            {publishMode === "schedule"
              ? `Your post will be published on ${scheduleDate} at ${scheduleTime}`
              : "Your post has been published to Instagram successfully."}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { store.reset(); setIsPublished(false); }}>
              Create Another Post
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Publish Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🚀 Publish Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPublishMode("now")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-all ${
                publishMode === "now"
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              <Send className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Publish Now</span>
              <span className="text-xs text-muted-foreground">Post immediately</span>
            </button>
            <button
              onClick={() => setPublishMode("schedule")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-all ${
                publishMode === "schedule"
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Schedule</span>
              <span className="text-xs text-muted-foreground">Post later</span>
            </button>
          </div>

          {publishMode === "schedule" && (
            <div className="space-y-4 rounded-xl border p-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
              </div>
            </div>
          )}

          <Button
            onClick={handlePublish}
            disabled={isPublishing || (publishMode === "schedule" && (!scheduleDate || !scheduleTime))}
            className="w-full h-12 text-base gap-2"
            size="lg"
          >
            {isPublishing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : publishMode === "now" ? (
              <Instagram className="h-5 w-5" />
            ) : (
              <Calendar className="h-5 w-5" />
            )}
            {isPublishing
              ? "Processing..."
              : publishMode === "now"
              ? "Publish to Instagram"
              : "Schedule Post"}
          </Button>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Post Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Title</span>
              <span className="text-sm font-medium">{store.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Category</span>
              <Badge variant="secondary">{store.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Caption</span>
              <Badge variant="secondary">{store.selectedCaptionType}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Hashtags</span>
              <Badge variant="secondary">{store.selectedHashtagType}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Theme</span>
              <span className="text-sm capitalize">{store.theme}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Layout</span>
              <span className="text-sm capitalize">{store.layout}</span>
            </div>
            {store.musicRecommendations[store.selectedMusicIndex] && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Music</span>
                <span className="text-sm">
                  {store.musicRecommendations[store.selectedMusicIndex].songName}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
