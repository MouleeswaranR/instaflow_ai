import Link from "next/link";
import {
  Sparkles,
  Zap,
  Image,
  Calendar,
  BarChart3,
  Bot,
  Code2,
  ArrowRight,
  Hash,
  Music,
  Layers,
  Globe,
} from "lucide-react";
import { InstagramIcon as Instagram, GithubIcon as Github } from "@/components/icons";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Caption Generator",
    description: "Generate viral, professional, and story captions with hooks, CTAs, and emojis automatically.",
  },
  {
    icon: Hash,
    title: "Smart Hashtags",
    description: "Get trending, niche, and mixed hashtag sets optimized for maximum reach and engagement.",
  },
  {
    icon: Image,
    title: "AI Image Generator",
    description: "Create stunning Instagram-ready images with 7 themes and multiple templates powered by AI.",
  },
  {
    icon: Layers,
    title: "Carousel Generator",
    description: "Auto-generate 5-slide educational carousels from a single topic or achievement.",
  },
  {
    icon: Music,
    title: "Music Recommendations",
    description: "Get perfect background music suggestions based on your content category and mood.",
  },
  {
    icon: Zap,
    title: "One-Click Publish",
    description: "Publish directly to Instagram or schedule for the perfect posting time.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts daily, weekly, or monthly with timezone support and recurring schedules.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track likes, comments, reach, impressions, saves, and shares with beautiful charts.",
  },
  {
    icon: Code2,
    title: "LeetCode Integration",
    description: "Auto-fetch your solved problems and streaks to generate coding achievement posts.",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Turn your commits, PRs, and releases into engaging social media content.",
  },
  {
    icon: Bot,
    title: "AI Social Media Agent",
    description: "Your personal AI manager that suggests posting times, improves content, and grows your brand.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Ready",
    description: "Generate captions optimized for Instagram, LinkedIn, and more — all from one input.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Instagram className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                InstaFlow <span className="text-gradient">AI</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="gap-1.5">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered Instagram Automation</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Turn Any Idea Into a{" "}
              <span className="text-gradient">Stunning Instagram</span>{" "}
              Post
            </h1>

            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              Enter a topic, achievement, or thought — and let AI generate captions, hashtags, 
              images, carousels, and music. Publish to Instagram in one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base gap-2 animate-pulse-glow">
                  Start Creating for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Demo preview */}
          <div className="relative mx-auto max-w-5xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="rounded-2xl border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
              <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" /> instaflow.ai/create
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-background via-background to-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Input mock */}
                  <div className="rounded-xl border bg-card p-5">
                    <div className="text-sm font-medium mb-3">✍️ Your Input</div>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">Solved LeetCode 146 LRU Cache</div>
                      <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                        Implemented using HashMap + Doubly Linked List
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                        💻 Coding
                      </div>
                    </div>
                  </div>
                  {/* AI Generated */}
                  <div className="rounded-xl border bg-card p-5">
                    <div className="text-sm font-medium mb-3">🤖 AI Generated</div>
                    <div className="space-y-2 text-xs">
                      <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
                        🔥 Day 42 of my coding journey and just cracked LRU Cache!
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {["#leetcode", "#coding", "#dsa", "#tech"].map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Preview mock */}
                  <div className="rounded-xl border bg-card p-5">
                    <div className="text-sm font-medium mb-3">📱 Preview</div>
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 via-chart-4/20 to-chart-5/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-2xl mb-1">💻</div>
                        <div className="text-sm font-bold">LRU Cache</div>
                        <div className="text-xs text-muted-foreground">Solved ✅</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything You Need to{" "}
              <span className="text-gradient">Dominate Instagram</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From content creation to publishing and analytics — powered by cutting-edge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border bg-card p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Three Steps to{" "}
              <span className="text-gradient">Instagram Mastery</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Enter Your Idea",
                description: "Type your topic, achievement, or thought. That's all the input you need.",
                emoji: "✍️",
              },
              {
                step: "02",
                title: "AI Does the Magic",
                description: "Captions, hashtags, images, carousels, and music — generated in seconds.",
                emoji: "🤖",
              },
              {
                step: "03",
                title: "Publish & Grow",
                description: "Preview, edit, and publish to Instagram. Schedule for the perfect time.",
                emoji: "🚀",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                <div className="text-6xl mb-4">{item.emoji}</div>
                <div className="text-xs font-bold text-primary mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-muted-foreground/30">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to Transform Your{" "}
            <span className="text-gradient">Instagram Game</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of creators automating their Instagram with AI.
          </p>
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Instagram className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">InstaFlow AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} InstaFlow AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
