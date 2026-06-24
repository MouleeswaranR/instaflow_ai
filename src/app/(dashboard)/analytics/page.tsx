"use client";

import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  Share2,
  TrendingUp,
  BarChart3,
  Users,
  Code2,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading analytics...</div>;
  }

  // Fallback to empty states if no data
  const chartData = data?.snapshots?.length > 0 ? data.snapshots : [
    { date: "Mon", likes: 0, comments: 0, reach: 0, impressions: 0 },
    { date: "Tue", likes: 0, comments: 0, reach: 0, impressions: 0 },
  ];

  const currentStats = data?.liveStats || data?.snapshots?.[data.snapshots.length - 1] || { likes: 0, comments: 0, reach: 0, impressions: 0, saves: 0, shares: 0 };

  const stats = [
    { label: "Total Likes", value: currentStats.likes, icon: Heart, trend: "+0%", color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Comments", value: currentStats.comments, icon: MessageCircle, trend: "+0%", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Reach", value: currentStats.reach, icon: Eye, trend: "+0%", color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Impressions", value: currentStats.impressions, icon: BarChart3, trend: "+0%", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Saves", value: currentStats.saves || 0, icon: Bookmark, trend: "+0%", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Shares", value: currentStats.shares || 0, icon: Share2, trend: "+0%", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your performance and integrations.</p>
      </div>

      {/* Integration Streaks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.github ? (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-chart-4/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">GitHub Activity</h3>
                  <p className="text-sm text-muted-foreground">@{data.github.username} • {data.github.publicRepos} Repos</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-primary">{data.github.streak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Streak</div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {data?.leetcode ? (
          <Card className="border-chart-2/20 bg-gradient-to-r from-chart-2/5 to-chart-3/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">LeetCode Activity</h3>
                  <p className="text-sm text-muted-foreground">@{data.leetcode.username} • {data.leetcode.totalSolved} Solved</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-chart-2">{data.leetcode.streak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Streak</div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid oklch(0.9 0 0)",
                    boxShadow: "0 4px 12px oklch(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="oklch(0.488 0.243 264.376)"
                  fill="url(#colorLikes)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid oklch(0.9 0 0)",
                    boxShadow: "0 4px 12px oklch(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="likes" fill="oklch(0.488 0.243 264.376)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="comments" fill="oklch(0.65 0.2 150)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
