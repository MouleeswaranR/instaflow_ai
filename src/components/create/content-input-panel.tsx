"use client";

import { useCreatePostStore } from "@/store/create-post-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CATEGORIES } from "@/lib/utils";

export function ContentInputPanel() {
  const { title, description, category, achievementType, notes, setInput, images, selectedImageId } = useCreatePostStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">✍️ Content Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Solved LeetCode 146 LRU Cache"
              value={title}
              onChange={(e) => setInput("title", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="e.g., Implemented LRU Cache using HashMap and Doubly Linked List. Optimized to O(1) time complexity."
              value={description}
              onChange={(e) => setInput("description", e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{description.length}/2000 characters</p>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setInput("category", cat.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                    category === cat.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievementType">Achievement Type (optional)</Label>
            <Input
              id="achievementType"
              placeholder="e.g., Problem Solved, Project Complete, Milestone"
              value={achievementType}
              onChange={(e) => setInput("achievementType", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Optional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional context or details..."
              value={notes}
              onChange={(e) => setInput("notes", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Custom Image(s)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  const formData = new FormData();

                  if (files.length === 1) {
                    formData.append("file", files[0]);
                  } else {
                    // Create Collage
                    try {
                      const blob = await new Promise<Blob>((resolve, reject) => {
                        const canvas = document.createElement("canvas");
                        canvas.width = 1080;
                        canvas.height = 1080;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return reject("No context");

                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, 1080, 1080);

                        const loadImg = (file: File) => new Promise<HTMLImageElement>((res, rej) => {
                          const img = new Image();
                          img.onload = () => res(img);
                          img.onerror = rej;
                          img.src = URL.createObjectURL(file);
                        });

                        Promise.all(files.slice(0, 4).map(loadImg)).then((images) => {
                          const drawImage = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
                            const imgRatio = img.width / img.height;
                            const targetRatio = w / h;
                            let sx, sy, sw, sh;
                            if (imgRatio > targetRatio) {
                              sh = img.height;
                              sw = img.height * targetRatio;
                              sx = (img.width - sw) / 2;
                              sy = 0;
                            } else {
                              sw = img.width;
                              sh = img.width / targetRatio;
                              sx = 0;
                              sy = (img.height - sh) / 2;
                            }
                            ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
                          };

                          const gap = 20;
                          const halfW = (1080 - gap) / 2;
                          const halfH = (1080 - gap) / 2;

                          if (images.length === 2) {
                            drawImage(images[0], 0, 0, halfW, 1080);
                            drawImage(images[1], halfW + gap, 0, halfW, 1080);
                          } else if (images.length === 3) {
                            drawImage(images[0], 0, 0, halfW, 1080);
                            drawImage(images[1], halfW + gap, 0, halfW, halfH);
                            drawImage(images[2], halfW + gap, halfH + gap, halfW, halfH);
                          } else {
                            drawImage(images[0], 0, 0, halfW, halfH);
                            drawImage(images[1], halfW + gap, 0, halfW, halfH);
                            drawImage(images[2], 0, halfH + gap, halfW, halfH);
                            drawImage(images[3], halfW + gap, halfH + gap, halfW, halfH);
                          }

                          canvas.toBlob((b) => {
                            if (b) resolve(b);
                            else reject("Blob failed");
                          }, "image/jpeg", 0.95);
                        }).catch(reject);
                      });
                      formData.append("file", blob, "collage.jpg");
                    } catch (err) {
                      console.error("Collage generation failed", err);
                      return;
                    }
                  }

                  // Upload to server
                  e.target.disabled = true; // basic lock
                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });
                    const data = await res.json();
                    if (data.url) {
                      const newImage = {
                        id: `uploaded-${Date.now()}`,
                        postId: "",
                        cloudinaryUrl: data.url,
                        publicId: data.publicId,
                        template: files.length > 1 ? "collage" : "custom",
                        theme: "custom",
                        width: data.width || 1080,
                        height: data.height || 1080,
                        isSelected: true,
                        createdAt: new Date(),
                      };
                      
                      // @ts-ignore
                      const { setImages, setSelectedImageId } = useCreatePostStore.getState();
                      setImages([newImage]);
                      setSelectedImageId(newImage.id);
                    }
                  } catch (error) {
                    console.error("Upload failed", error);
                  } finally {
                    e.target.disabled = false;
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Upload 1 image to use as-is, or 2-4 images to automatically create a collage.</p>
          </div>
        </CardContent>
      </Card>

      {/* Live preview */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">📱 Quick Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-xs">
            <div className="rounded-2xl border bg-card overflow-hidden shadow-lg">
              {/* Image preview */}
              <div className="relative aspect-square bg-gradient-to-br from-primary/20 via-chart-4/10 to-chart-5/20 flex items-center justify-center p-6 overflow-hidden">
                {images.find(img => img.id === selectedImageId) ? (
                  <img 
                    src={images.find(img => img.id === selectedImageId)?.cloudinaryUrl} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center relative z-10">
                    <div className="text-4xl mb-3">
                      {CATEGORIES.find((c) => c.value === category)?.emoji || "✨"}
                    </div>
                    <div className="text-lg font-bold leading-tight mb-1">
                      {title || "Your Title Here"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {description ? description.slice(0, 60) + (description.length > 60 ? "..." : "") : "Your description will appear here"}
                    </div>
                  </div>
                )}
              </div>
              {/* Caption preview */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/20" />
                  <span className="text-xs font-medium">your_username</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {description || "Caption will appear here..."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
