"use client";

import { useState } from "react";
import {
  PenSquare,
  Sparkles,
  Palette,
  Eye,
  Send,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreatePostStore } from "@/store/create-post-store";
import { ContentInputPanel } from "@/components/create/content-input-panel";
import { GeneratePanel } from "@/components/create/generate-panel";
import { DesignEngine } from "@/components/create/design-engine";
import { PostPreview } from "@/components/create/post-preview";
import { PublishPanel } from "@/components/create/publish-panel";

const steps = [
  { id: 0, label: "Input", icon: PenSquare, description: "Enter your content" },
  { id: 1, label: "Generate", icon: Sparkles, description: "AI creates content" },
  { id: 2, label: "Design", icon: Palette, description: "Customize the look" },
  { id: 3, label: "Preview", icon: Eye, description: "Review your post" },
  { id: 4, label: "Publish", icon: Send, description: "Publish or schedule" },
];

export default function CreatePostPage() {
  const { currentStep, setCurrentStep, title, description } = useCreatePostStore();

  const canProceed = () => {
    if (currentStep === 0) return title.trim().length > 0 && description.trim().length > 0;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground mt-1">
          Enter your topic and let AI generate everything for Instagram.
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => {
              if (i <= currentStep || canProceed()) setCurrentStep(i);
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium whitespace-nowrap transition-all",
              currentStep === i
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : i < currentStep
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <step.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{step.label}</span>
            {i < steps.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 ml-1 hidden lg:block" />
            )}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="animate-fade-in">
        {currentStep === 0 && <ContentInputPanel />}
        {currentStep === 1 && <GeneratePanel />}
        {currentStep === 2 && <DesignEngine />}
        {currentStep === 3 && <PostPreview />}
        {currentStep === 4 && <PublishPanel />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        {currentStep < 4 && (
          <Button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
