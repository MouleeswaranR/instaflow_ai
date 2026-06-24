"use client";

import { useCreatePostStore } from "@/store/create-post-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES } from "@/lib/utils";

export function PostPreview() {
  const store = useCreatePostStore();
  const selectedCaption = store.captions.find((c) => c.type === store.selectedCaptionType);
  const selectedHashtags = store.hashtags.find((h) => h.type === store.selectedHashtagType);
  const selectedMusic = store.musicRecommendations[store.selectedMusicIndex];
  const categoryEmoji = CATEGORIES.find((c) => c.value === store.category)?.emoji || "✨";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Phone Preview */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <div className="rounded-[2.5rem] border-[3px] border-foreground/10 bg-card p-3 shadow-2xl">
            {/* Phone screen */}
            <div className="rounded-[2rem] overflow-hidden bg-background">
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 py-2 text-xs">
                <span className="font-semibold">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-4 rounded-sm border border-foreground/50" />
                </div>
              </div>

              {/* Instagram header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-chart-4" />
                <span className="text-sm font-semibold">your_username</span>
              </div>

              {/* Image */}
              <div
                className="relative aspect-square bg-gradient-to-br from-primary/20 via-chart-4/10 to-chart-5/20 flex items-center justify-center p-8 overflow-hidden"
              >
                {store.images.find(img => img.id === store.selectedImageId) ? (
                  <img 
                    src={store.images.find(img => img.id === store.selectedImageId)?.url} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center relative z-10">
                    <div className="text-5xl mb-3">{categoryEmoji}</div>
                    <div className="text-xl font-bold leading-tight mb-2">{store.title || "Your Title"}</div>
                    <div className="text-xs text-muted-foreground max-w-48">
                      {store.description?.slice(0, 80) || "Description"}
                    </div>
                  </div>
                )}
              </div>

              {/* Engagement icons */}
              <div className="flex items-center gap-4 px-4 py-3">
                <span className="text-lg">♡</span>
                <span className="text-lg">💬</span>
                <span className="text-lg">↗</span>
                <span className="ml-auto text-lg">☆</span>
              </div>

              {/* Caption */}
              <div className="px-4 pb-4">
                <p className="text-xs leading-relaxed">
                  <span className="font-semibold mr-1">your_username</span>
                  {selectedCaption?.content?.slice(0, 150) || "Your AI-generated caption will appear here..."}
                  {(selectedCaption?.content?.length || 0) > 150 && (
                    <span className="text-muted-foreground"> ...more</span>
                  )}
                </p>
                {selectedHashtags && (
                  <p className="text-xs text-primary mt-1">
                    {selectedHashtags.hashtags.slice(0, 5).join(" ")}
                    {selectedHashtags.hashtags.length > 5 && " ..."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 Caption</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCaption ? (
              <div>
                <Badge className="mb-2">{selectedCaption.type}</Badge>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedCaption.content}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No caption selected. Go to Generate step.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg"># Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedHashtags ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedHashtags.hashtags.map((tag) => (
                  <span key={tag} className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hashtags selected.</p>
            )}
          </CardContent>
        </Card>

        {selectedMusic && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎵 Recommended Music</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-chart-4/20 text-lg">
                  🎵
                </div>
                <div>
                  <div className="font-medium text-sm">{selectedMusic.songName}</div>
                  <div className="text-xs text-muted-foreground">{selectedMusic.artist} · {selectedMusic.mood}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⚙️ Design Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Theme</p>
                <p className="text-sm font-medium capitalize">{store.theme}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Font</p>
                <p className="text-sm font-medium capitalize">{store.font}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Layout</p>
                <p className="text-sm font-medium capitalize">{store.layout}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
