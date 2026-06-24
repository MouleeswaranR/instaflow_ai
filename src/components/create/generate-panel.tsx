"use client";

import { useState } from "react";
import {
  Sparkles,
  Hash,
  Image,
  Layers,
  Music,
  Loader2,
  Check,
  Copy,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreatePostStore } from "@/store/create-post-store";
import { toast } from "sonner";

export function GeneratePanel() {
  const store = useCreatePostStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateAll = async () => {
    await Promise.all([
      generateCaptions(),
      generateHashtags(),
      generateMusic(),
      generateImage(),
    ]);
  };

  const generateCaptions = async () => {
    store.setLoading("Captions", true);
    try {
      const res = await fetch("/api/generate/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.title,
          description: store.description,
          category: store.category,
          achievementType: store.achievementType,
          notes: store.notes,
        }),
      });
      const data = await res.json();
      if (data.captions) {
        store.setCaptions(data.captions);
        toast.success("Captions generated!");
      }
    } catch {
      toast.error("Failed to generate captions");
    } finally {
      store.setLoading("Captions", false);
    }
  };

  const generateHashtags = async () => {
    store.setLoading("Hashtags", true);
    try {
      const res = await fetch("/api/generate/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.title,
          description: store.description,
          category: store.category,
          notes: store.notes,
        }),
      });
      const data = await res.json();
      if (data.hashtags) {
        store.setHashtags(data.hashtags);
        toast.success("Hashtags generated!");
      }
    } catch {
      toast.error("Failed to generate hashtags");
    } finally {
      store.setLoading("Hashtags", false);
    }
  };

  const generateMusic = async () => {
    store.setLoading("Music", true);
    try {
      const res = await fetch("/api/generate/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.title,
          description: store.description,
          category: store.category,
        }),
      });
      const data = await res.json();
      if (data.recommendations) {
        store.setMusicRecommendations(data.recommendations);
        toast.success("Music recommendations ready!");
      }
    } catch {
      toast.error("Failed to generate music recommendations");
    } finally {
      store.setLoading("Music", false);
    }
  };

  const [customInstruction, setCustomInstruction] = useState("");

  const generateImage = async (instruction?: string) => {
    store.setLoading("Images", true);
    
    const selectedCaption = store.captions.find(c => c.type === store.selectedCaptionType)?.content;
    const selectedHashtags = store.hashtags.find(h => h.type === store.selectedHashtagType)?.hashtags.join(" ");

    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.title,
          description: store.description,
          category: store.category,
          theme: store.theme,
          customInstruction: instruction || customInstruction,
          caption: selectedCaption,
          hashtags: selectedHashtags,
        }),
      });
      const data = await res.json();
      if (data.image) {
        store.setImages([data.image]);
        store.setSelectedImageId(data.image.id);
        toast.success("Image generated!");
      }
    } catch {
      toast.error("Failed to generate image");
    } finally {
      store.setLoading("Images", false);
    }
  };

  const generateCarousel = async () => {
    store.setLoading("Carousel", true);
    try {
      const res = await fetch("/api/generate/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.title,
          description: store.description,
          category: store.category,
          notes: store.notes,
        }),
      });
      const data = await res.json();
      if (data.slides) {
        store.setCarouselSlides(data.slides);
        toast.success("Carousel content generated!");
      }
    } catch {
      toast.error("Failed to generate carousel");
    } finally {
      store.setLoading("Carousel", false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const isAnyLoading =
    store.isGeneratingCaptions ||
    store.isGeneratingHashtags ||
    store.isGeneratingImages ||
    store.isGeneratingMusic;

  return (
    <div className="space-y-6">
      {/* Generate All button */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-chart-4/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">🤖 AI Content Generator</h3>
              <p className="text-sm text-muted-foreground">
                Generate captions, hashtags, and music recommendations for &quot;{store.title}&quot;
              </p>
            </div>
            <Button
              onClick={generateAll}
              disabled={isAnyLoading}
              className="gap-2 min-w-[160px]"
              size="lg"
            >
              {isAnyLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isAnyLoading ? "Generating..." : "Generate All"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="captions" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="captions" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Captions
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="gap-1.5">
            <Hash className="h-3.5 w-3.5" /> Hashtags
          </TabsTrigger>
          <TabsTrigger value="carousel" className="gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Carousel
          </TabsTrigger>
          <TabsTrigger value="music" className="gap-1.5">
            <Music className="h-3.5 w-3.5" /> Music
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-1.5">
            <Image className="h-3.5 w-3.5" /> Image
          </TabsTrigger>
        </TabsList>

        {/* Captions Tab */}
        <TabsContent value="captions" className="space-y-4">
          {store.captions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Sparkles className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Click &quot;Generate All&quot; or generate captions individually</p>
                <Button onClick={generateCaptions} disabled={store.isGeneratingCaptions} variant="outline" className="gap-2">
                  {store.isGeneratingCaptions ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate Captions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {store.captions.map((caption) => (
                <Card
                  key={caption.type}
                  className={`cursor-pointer transition-all ${
                    store.selectedCaptionType === caption.type
                      ? "border-primary shadow-md shadow-primary/10"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => store.setSelectedCaptionType(caption.type)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Badge
                        variant={store.selectedCaptionType === caption.type ? "default" : "secondary"}
                      >
                        {caption.type}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(caption.content, caption.type);
                          }}
                        >
                          {copiedId === caption.type ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{caption.content}</p>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={generateCaptions} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Hashtags Tab */}
        <TabsContent value="hashtags" className="space-y-4">
          {store.hashtags.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Hash className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Generate hashtag sets for your post</p>
                <Button onClick={generateHashtags} disabled={store.isGeneratingHashtags} variant="outline" className="gap-2">
                  {store.isGeneratingHashtags ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
                  Generate Hashtags
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {store.hashtags.map((set) => (
                <Card
                  key={set.type}
                  className={`cursor-pointer transition-all ${
                    store.selectedHashtagType === set.type
                      ? "border-primary shadow-md shadow-primary/10"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => store.setSelectedHashtagType(set.type)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={store.selectedHashtagType === set.type ? "default" : "secondary"}>
                        {set.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{set.hashtags.length} tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {set.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(set.hashtags.join(" "), set.type);
                      }}
                    >
                      {copiedId === set.type ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      Copy all
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Carousel Tab */}
        <TabsContent value="carousel" className="space-y-4">
          {store.carouselSlides.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Layers className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Generate a 5-slide carousel from your content</p>
                <Button onClick={generateCarousel} disabled={store.isGeneratingCarousel} variant="outline" className="gap-2">
                  {store.isGeneratingCarousel ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
                  Generate Carousel
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {store.carouselSlides.map((slide) => (
                <Card key={slide.slideNumber} className="overflow-hidden">
                  <div className="bg-gradient-to-br from-primary/10 to-chart-4/10 p-4 text-center">
                    <div className="text-xs font-medium text-primary mb-1">Slide {slide.slideNumber}</div>
                    <div className="text-sm font-bold">{slide.title}</div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">{slide.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Music Tab */}
        <TabsContent value="music" className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 mb-4 flex items-start gap-3">
            <span className="text-amber-500 text-lg">⚠️</span>
            <div className="text-sm text-amber-500/90 leading-snug">
              <span className="font-semibold block mb-1">Instagram API Limitation</span>
              The official Instagram API does not allow auto-publishing music with image posts. These recommendations are saved for your reference if you decide to post manually through the app.
            </div>
          </div>
          {store.musicRecommendations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Music className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Get music recommendations for your post</p>
                <Button onClick={generateMusic} disabled={store.isGeneratingMusic} variant="outline" className="gap-2">
                  {store.isGeneratingMusic ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
                  Recommend Music
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {store.musicRecommendations.map((song, i) => (
                <Card
                  key={i}
                  className={`cursor-pointer transition-all ${
                    store.selectedMusicIndex === i
                      ? "border-primary shadow-md shadow-primary/10"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => store.setSelectedMusicIndex(i)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-chart-4/20 text-lg">
                      🎵
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{song.songName}</div>
                      <div className="text-xs text-muted-foreground">{song.artist}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className="mb-1">{song.mood}</Badge>
                      <div className="text-xs text-muted-foreground">{song.popularityScore}% match</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        {/* Image Tab */}
        <TabsContent value="image" className="space-y-4">
          {store.images.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Image className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Generate an AI image for your post</p>
                <Button onClick={() => generateImage()} disabled={store.isGeneratingImages} variant="outline" className="gap-2">
                  {store.isGeneratingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
                  Generate Image
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-5 flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0">
                    <img 
                      src={store.images.find(img => img.id === store.selectedImageId)?.url} 
                      alt="Generated" 
                      className="w-48 h-48 object-cover rounded-xl border shadow-sm"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">AI Image Edit</h4>
                      <p className="text-xs text-muted-foreground">Not quite right? Refine the image by telling the AI what to change or add.</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Make it minimalist with a blue tone"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                      />
                      <Button onClick={() => generateImage(customInstruction)} disabled={store.isGeneratingImages || !customInstruction.trim()} size="sm" className="gap-2 whitespace-nowrap">
                        {store.isGeneratingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Regenerate
                      </Button>
                    </div>
                    <Button onClick={() => generateImage("")} disabled={store.isGeneratingImages} variant="outline" size="sm" className="w-full gap-2 mt-4">
                      <RefreshCw className="h-4 w-4" /> Regenerate Completely
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
