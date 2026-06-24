import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const githubAccount = await prisma.account.findFirst({
      where: { userId: session.user.id, provider: "github" },
    });

    const githubIntegration = await prisma.gitHubIntegration.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ 
      isConnected: !!githubAccount,
      autoPost: githubIntegration?.autoPost ?? false
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

import { fetchGitHubProfile, calculateGitHubStreak } from "@/services/github.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { autoPost } = await req.json();

    const githubAccount = await prisma.account.findFirst({
      where: { userId: session.user.id, provider: "github" },
    });

    if (!githubAccount || !githubAccount.access_token) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
    }

    const accessToken = githubAccount.access_token;

    // Fetch GitHub profile and streak
    const profile = await fetchGitHubProfile(accessToken);
    const streak = await calculateGitHubStreak(accessToken, profile.username);

    const integration = await prisma.gitHubIntegration.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        githubUsername: profile.username,
        accessToken: accessToken,
        publicRepos: profile.publicRepos,
        followers: profile.followers,
        streak: streak,
        autoPost: autoPost ?? false,
        lastSyncAt: new Date(),
      },
      update: {
        githubUsername: profile.username,
        accessToken: accessToken,
        publicRepos: profile.publicRepos,
        followers: profile.followers,
        streak: streak,
        ...(autoPost !== undefined && { autoPost }),
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({ integration });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.account.deleteMany({
      where: { userId: session.user.id, provider: "github" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
