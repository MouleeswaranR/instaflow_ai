import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch integrations to get real stats
    const [instagramAccount, initialGithubIntegration, leetcodeIntegration, githubAccount] = await Promise.all([
      prisma.instagramAccount.findFirst({
        where: { userId, isActive: true },
        orderBy: { connectedAt: "desc" },
      }),
      prisma.gitHubIntegration.findUnique({
        where: { userId },
      }),
      prisma.leetCodeIntegration.findUnique({
        where: { userId },
      }),
      prisma.account.findFirst({
        where: { userId, provider: "github" },
      }),
    ]);

    let githubIntegration = initialGithubIntegration;

    // If GitHub is connected but integration stats aren't synced yet, sync them now
    if ((!githubIntegration || !githubIntegration.lastSyncAt) && githubAccount?.access_token) {
      try {
        const { fetchGitHubProfile, calculateGitHubStreak } = await import("@/services/github.service");
        const profile = await fetchGitHubProfile(githubAccount.access_token);
        const streak = await calculateGitHubStreak(githubAccount.access_token, profile.username);
        
        githubIntegration = await prisma.gitHubIntegration.upsert({
          where: { userId },
          update: {
            githubUsername: profile.username,
            accessToken: githubAccount.access_token,
            publicRepos: profile.publicRepos,
            followers: profile.followers,
            streak: streak,
            lastSyncAt: new Date(),
          },
          create: {
            userId,
            githubUsername: profile.username,
            accessToken: githubAccount.access_token,
            publicRepos: profile.publicRepos,
            followers: profile.followers,
            streak: streak,
            lastSyncAt: new Date(),
          }
        });
      } catch (err) {
        console.error("Failed to auto-sync GitHub stats for analytics:", err instanceof Error ? err.message : String(err));
      }
    }

    // Sync live Instagram insights
    const liveStats = { likes: 0, comments: 0, reach: 0, impressions: 0, saves: 0, shares: 0 };
    
    if (instagramAccount) {
      try {
        const { getMediaInsights } = await import("@/lib/instagram");
        
        // Find published posts with instagramPostId
        const publishedPosts = await prisma.post.findMany({
          where: { userId, instagramPostId: { not: null } },
        });

        const insightsPromises = publishedPosts.map(post => 
          getMediaInsights(instagramAccount.accessToken, post.instagramPostId!)
        );
        
        const allInsights = await Promise.allSettled(insightsPromises);
        
        allInsights.forEach(result => {
          if (result.status === "fulfilled" && result.value) {
            liveStats.likes += result.value.likes || 0;
            liveStats.comments += result.value.comments || 0;
            liveStats.reach += result.value.reach || 0;
            liveStats.impressions += result.value.impressions || 0;
            liveStats.saves += result.value.saved || 0;
            liveStats.shares += result.value.shares || 0;
          }
        });
        
        // Update today's snapshot
        const todayStr = new Date().toISOString().split("T")[0];
        const todayDate = new Date(todayStr);
        
        await prisma.analyticsSnapshot.upsert({
          where: { userId_date: { userId, date: todayDate } },
          update: liveStats,
          create: {
            userId,
            date: todayDate,
            ...liveStats
          }
        }).catch(err => console.error("Could not upsert live stats snapshot:", err));
        
      } catch (err) {
        console.error("Failed to fetch live Instagram insights:", err instanceof Error ? err.message : String(err));
      }
    }

    // Reload snapshots to include the live update
    const freshSnapshots = await prisma.analyticsSnapshot.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 30,
    });

    // Format data
    const analyticsData = {
      instagram: instagramAccount ? {
        followers: instagramAccount.followersCount,
        mediaCount: instagramAccount.mediaCount,
        username: instagramAccount.username,
      } : null,
      github: githubIntegration ? {
        username: githubIntegration.githubUsername,
        publicRepos: githubIntegration.publicRepos,
        followers: githubIntegration.followers,
        streak: githubIntegration.streak,
        lastSync: githubIntegration.lastSyncAt,
      } : null,
      leetcode: leetcodeIntegration ? {
        username: leetcodeIntegration.username,
        totalSolved: leetcodeIntegration.totalSolved,
        easySolved: leetcodeIntegration.easySolved,
        mediumSolved: leetcodeIntegration.mediumSolved,
        hardSolved: leetcodeIntegration.hardSolved,
        streak: leetcodeIntegration.streak,
        lastSync: leetcodeIntegration.lastSyncAt,
      } : null,
      snapshots: freshSnapshots.map((s) => ({
        date: s.date.toISOString().split("T")[0],
        likes: s.likes,
        comments: s.comments,
        reach: s.reach,
        impressions: s.impressions,
        saves: s.saves,
        shares: s.shares,
      })),
      liveStats, // pass the live aggregated stats directly
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
