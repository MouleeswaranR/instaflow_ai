"use client";

import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  Share2,
  TrendingUp,
  BarChart3,
  Code2,
  Trophy,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Custom Tooltip for Area and Bar Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-xl border border-border p-4 rounded-xl shadow-xl flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground border-b border-border/50 pb-2 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">Crunching your numbers...</p>
        </div>
      </div>
    );
  }

  // Fallback to empty states if no data
  const chartData = data?.snapshots?.length > 0 ? data.snapshots : [
    { date: "Mon", likes: 0, comments: 0, reach: 0, impressions: 0, saves: 0, shares: 0 },
    { date: "Tue", likes: 0, comments: 0, reach: 0, impressions: 0, saves: 0, shares: 0 },
  ];

  const currentStats = data?.liveStats || data?.snapshots?.[data.snapshots.length - 1] || { likes: 0, comments: 0, reach: 0, impressions: 0, saves: 0, shares: 0 };

  const stats = [
    { label: "Total Reach", value: currentStats.reach, icon: Eye, trend: "+12%", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Impressions", value: currentStats.impressions, icon: BarChart3, trend: "+8%", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Likes", value: currentStats.likes, icon: Heart, trend: "+24%", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Comments", value: currentStats.comments, icon: MessageCircle, trend: "+5%", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Saves", value: currentStats.saves || 0, icon: Bookmark, trend: "+18%", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Shares", value: currentStats.shares || 0, icon: Share2, trend: "+3%", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  const leetcodeData = data?.leetcode ? [
    { name: 'Easy', value: data.leetcode.easySolved, color: '#10b981' }, // emerald-500
    { name: 'Medium', value: data.leetcode.mediumSolved, color: '#f59e0b' }, // amber-500
    { name: 'Hard', value: data.leetcode.hardSolved, color: '#f43f5e' }, // rose-500
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Analytics Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Your performance metrics across all integrated platforms.</p>
        </div>
      </div>

      {/* Developer Integrations (Top Highlights) */}
      {(data?.github || data?.leetcode) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.github && (
            <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                      <Github className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl tracking-tight text-foreground">GitHub Activity</h3>
                      <p className="text-sm font-medium text-muted-foreground">@{data.github.username}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60">
                        {data.github.streak}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">days</span>
                    </div>
                    <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-none text-xs font-semibold">Current Streak</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                  <div className="bg-background/60 rounded-xl p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Public Repos</p>
                    <p className="text-2xl font-bold">{data.github.publicRepos}</p>
                  </div>
                  <div className="bg-background/60 rounded-xl p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Followers</p>
                    <p className="text-2xl font-bold">{data.github.followers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {data?.leetcode && (
            <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center border border-amber-500/10 shadow-inner">
                      <Code2 className="h-7 w-7 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl tracking-tight text-foreground">LeetCode Stats</h3>
                      <p className="text-sm font-medium text-muted-foreground">@{data.leetcode.username}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-amber-600">
                        {data.leetcode.totalSolved}
                      </span>
                    </div>
                    <Badge variant="secondary" className="mt-1 bg-amber-500/10 text-amber-600 border-none text-xs font-semibold">Total Solved</Badge>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 relative z-10">
                  <div className="flex-1 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20 flex flex-col items-center">
                    <p className="text-[10px] text-emerald-600 uppercase tracking-bolder font-bold mb-1">Easy</p>
                    <p className="text-xl font-black text-emerald-600">{data.leetcode.easySolved}</p>
                  </div>
                  <div className="flex-1 bg-amber-500/10 rounded-xl p-3 border border-amber-500/20 flex flex-col items-center">
                    <p className="text-[10px] text-amber-600 uppercase tracking-bolder font-bold mb-1">Medium</p>
                    <p className="text-xl font-black text-amber-600">{data.leetcode.mediumSolved}</p>
                  </div>
                  <div className="flex-1 bg-rose-500/10 rounded-xl p-3 border border-rose-500/20 flex flex-col items-center">
                    <p className="text-[10px] text-rose-600 uppercase tracking-bolder font-bold mb-1">Hard</p>
                    <p className="text-xl font-black text-rose-600">{data.leetcode.hardSolved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <Card 
            key={stat.label} 
            className={cn(
              "overflow-hidden border bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300",
              stat.border
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color} mb-4`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <div className="text-2xl font-black text-foreground">{stat.value.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Area Chart (Span 2) */}
        <Card className="lg:col-span-2 border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-background/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Audience Growth</CardTitle>
                <CardDescription>Reach vs Impressions over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={12}
                    stroke="hsl(var(--muted-foreground))" 
                  />
                  <YAxis 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    name="Impressions"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#colorImpressions)"
                    activeDot={{ r: 6, fill: "#8b5cf6", stroke: "var(--background)", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    name="Reach"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorReach)"
                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "var(--background)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* LeetCode Donut Chart (Span 1) */}
        {data?.leetcode ? (
          <Card className="border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-background/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Problem Distribution</CardTitle>
                  <CardDescription>LeetCode difficulty ratio</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col items-center justify-center relative">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Pie
                      data={leetcodeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {leetcodeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value, entry: any) => <span className="text-foreground font-medium ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center Text */}
              <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-3xl font-black">{data.leetcode.totalSolved}</p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Code2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-2">Connect LeetCode</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect your account in Integrations to view problem solving analytics.</p>
          </Card>
        )}

      </div>

      {/* Scatter & Content Type Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engagement Composed Chart (Span 2) */}
        <Card className="lg:col-span-2 border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-background/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Engagement Breakdown</CardTitle>
                <CardDescription>Daily interactions on your posts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={12}
                    stroke="hsl(var(--muted-foreground))" 
                  />
                  <YAxis 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={12}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={50}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "10px" }}
                  />
                  
                  <Bar dataKey="likes" name="Likes" stackId="a" fill="#f43f5e" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="comments" name="Comments" stackId="a" fill="#10b981" />
                  <Bar dataKey="saves" name="Saves" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="shares" name="Shares" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="reach" 
                    name="Total Reach"
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "var(--background)", strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Content Type Chart (Span 1) */}
        <Card className="border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-background/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Content Types</CardTitle>
                <CardDescription>Avg Reach by format</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[400px] w-full">
              {data?.postsPerformance && data.postsPerformance.length > 0 ? (() => {
                const grouped = data.postsPerformance.reduce((acc: any, post: any) => {
                  acc[post.type] = acc[post.type] || { reach: 0, count: 0 };
                  acc[post.type].reach += post.reach;
                  acc[post.type].count += 1;
                  return acc;
                }, {});
                const typeData = Object.keys(grouped).map(type => ({
                  type,
                  avgReach: Math.round(grouped[type].reach / grouped[type].count)
                }));
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeData} margin={{ top: 20, right: 0, bottom: 20, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="type" fontSize={12} tickLine={false} axisLine={false} tickMargin={12} stroke="hsl(var(--muted-foreground))" />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickMargin={12} stroke="hsl(var(--muted-foreground))" />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                      <Bar dataKey="avgReach" name="Avg Reach" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'Carousel' ? '#f59e0b' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                );
              })() : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No post data available</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Scatter Plot */}
      {data?.postsPerformance && data.postsPerformance.length > 0 && (
        <Card className="border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-background/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Reach vs Engagement</CardTitle>
                <CardDescription>Scatter plot of recent posts (size = impressions)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    type="number" 
                    dataKey="reach" 
                    name="Reach" 
                    fontSize={12} tickLine={false} axisLine={false} tickMargin={12} stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="engagement" 
                    name="Engagement" 
                    fontSize={12} tickLine={false} axisLine={false} tickMargin={12} stroke="hsl(var(--muted-foreground))"
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="impressions" 
                    range={[60, 400]} 
                    name="Impressions" 
                  />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background/80 backdrop-blur-xl border border-border p-4 rounded-xl shadow-xl flex flex-col gap-2 max-w-[200px]">
                          <p className="text-sm font-semibold text-foreground border-b border-border/50 pb-2 mb-1 truncate">{data.caption}</p>
                          <p className="text-xs text-muted-foreground">Reach: <span className="font-bold text-foreground">{data.reach}</span></p>
                          <p className="text-xs text-muted-foreground">Engagement: <span className="font-bold text-foreground">{data.engagement}</span></p>
                          <p className="text-xs text-muted-foreground">Impressions: <span className="font-bold text-foreground">{data.impressions}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Scatter name="Posts" data={data.postsPerformance} fill="#10b981" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unified Timeline */}
      <Card className="border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-background/50 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Code2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Activity Timeline</CardTitle>
              <CardDescription>Recent cross-platform milestones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {data?.postsPerformance?.slice(0, 3).map((post: any) => (
              <div key={post.id} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-foreground">Instagram Post Published</p>
                  <p className="text-xs text-muted-foreground mt-1">"{post.caption}" achieved {post.reach} reach</p>
                </div>
              </div>
            ))}
            {data?.leetcode?.lastSync && (
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-foreground">LeetCode Streak Extended</p>
                  <p className="text-xs text-muted-foreground mt-1">Maintained a {data.leetcode.streak} day solving streak</p>
                </div>
              </div>
            )}
            {data?.github?.lastSync && (
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">GitHub Streak Synced</p>
                  <p className="text-xs text-muted-foreground mt-1">Maintained a {data.github.streak} day commit streak</p>
                </div>
              </div>
            )}
            {(!data?.postsPerformance?.length && !data?.leetcode && !data?.github) && (
              <div className="text-center text-sm text-muted-foreground py-4">No recent activity to show.</div>
            )}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
