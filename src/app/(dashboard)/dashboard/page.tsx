"use client";

import Link from "next/link";
import {
  PenSquare,
  FileText,
  Calendar,
  BarChart3,
  Plug,
  Bot,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Posts", value: "0", icon: FileText, trend: "+0%", color: "text-primary" },
  { label: "Total Likes", value: "0", icon: Heart, trend: "+0%", color: "text-red-500" },
  { label: "Comments", value: "0", icon: MessageCircle, trend: "+0%", color: "text-blue-500" },
  { label: "Reach", value: "0", icon: Eye, trend: "+0%", color: "text-green-500" },
];

import { useEffect, useState } from "react";
import Image from "next/image";

const quickActions = [
  { label: "Create Post", href: "/create", icon: PenSquare, description: "Generate a new Instagram post with AI" },
  { label: "Schedule", href: "/schedule", icon: Calendar, description: "View and manage your scheduled posts" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, description: "Track your Instagram performance" },
  { label: "AI Agent", href: "/ai-agent", icon: Bot, description: "Chat with your AI social media manager" },
  { label: "Integrations", href: "/integrations", icon: Plug, description: "Connect Instagram, GitHub, LeetCode" },
];

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, postsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/posts")
        ]);
        
        const analyticsJson = await analyticsRes.json();
        const postsJson = await postsRes.json();
        
        setStatsData(analyticsJson);
        setRecentPosts(postsJson.posts?.slice(0, 3) || []);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentStats = statsData?.liveStats || statsData?.snapshots?.[statsData.snapshots.length - 1] || { likes: 0, comments: 0, reach: 0, impressions: 0 };
  const totalPosts = statsData?.instagram?.mediaCount || recentPosts.length || 0;

  const stats = [
    { label: "Total Posts", value: totalPosts.toString(), icon: FileText, trend: "+0%", color: "text-primary" },
    { label: "Total Likes", value: currentStats.likes?.toString() || "0", icon: Heart, trend: "+0%", color: "text-red-500" },
    { label: "Comments", value: currentStats.comments?.toString() || "0", icon: MessageCircle, trend: "+0%", color: "text-blue-500" },
    { label: "Reach", value: currentStats.reach?.toString() || "0", icon: Eye, trend: "+0%", color: "text-green-500" },
  ];

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your Instagram overview.</p>
        </div>
        <Link href="/create">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-xs gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                         <h3 className="font-medium">{action.label}</h3>
                         <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.generatedImages?.[0]?.cloudinaryUrl ? (
                  <div className="relative aspect-square w-full">
                    <img 
                      src={post.generatedImages[0].cloudinaryUrl} 
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium truncate">{post.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <PenSquare className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No posts yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Create your first AI-powered Instagram post and start growing your presence.
              </p>
              <Link href="/create">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" /> Create Your First Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
