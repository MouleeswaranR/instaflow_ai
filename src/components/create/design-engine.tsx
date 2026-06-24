"use client";

import { useCreatePostStore } from "@/store/create-post-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { THEMES, FONTS, LAYOUTS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Square, Layers, Smartphone } from "lucide-react";

const layoutIcons = { SINGLE: Square, CAROUSEL: Layers, STORY: Smartphone };

export function DesignEngine() {
  const { theme, setTheme, font, setFont, layout, setLayout } = useCreatePostStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎨 Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                  theme === t.value
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div
                  className="h-12 w-12 rounded-lg border shadow-sm"
                  style={{ backgroundColor: t.preview }}
                />
                <span className="text-xs font-medium">{t.label}</span>
                {theme === t.value && (
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">✏️ Font</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {FONTS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFont(f.value)}
                className={cn(
                  "w-full flex items-center gap-4 rounded-xl border p-4 transition-all text-left",
                  font === f.value
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold">
                  Aa
                </div>
                <div>
                  <div className="text-sm font-medium">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.family}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📐 Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LAYOUTS.map((l) => {
              const Icon = layoutIcons[l.value as keyof typeof layoutIcons];
              return (
                <button
                  key={l.value}
                  onClick={() => setLayout(l.value)}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-xl border p-4 transition-all text-left",
                    layout === l.value
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">{l.label}</div>
                </button>
              );
            })}
          </div>

          {/* Size preview */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground mb-2">Output Size</p>
            <p className="text-sm font-medium">
              {layout === "SINGLE" && "1080 × 1080px"}
              {layout === "CAROUSEL" && "1080 × 1350px"}
              {layout === "STORY" && "1080 × 1920px"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
