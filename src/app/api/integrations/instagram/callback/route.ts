import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getProfile,
} from "@/lib/instagram";
import { absoluteUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL("/integrations?error=instagram_denied", req.nextUrl.origin)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/integrations?error=no_code", req.nextUrl.origin)
      );
    }

    const redirectUri = absoluteUrl("/api/integrations/instagram/callback");

    // Exchange code for short-lived token
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // Get long-lived token
    const longLivedToken = await getLongLivedToken(tokenData.access_token);

    // Get profile info (this automatically finds the linked IG account)
    const profile = await getProfile(longLivedToken.access_token);

    // Save to database using the ID from the profile
    await prisma.instagramAccount.upsert({
      where: { instagramUserId: profile.id },
      create: {
        userId: session.user.id,
        instagramUserId: profile.id,
        username: profile.username,
        accessToken: longLivedToken.access_token,
        tokenExpiresAt: new Date(
          Date.now() + longLivedToken.expires_in * 1000
        ),
        profilePictureUrl: profile.profile_picture_url,
        followersCount: profile.followers_count,
        followingCount: profile.follows_count,
        mediaCount: profile.media_count,
      },
      update: {
        accessToken: longLivedToken.access_token,
        tokenExpiresAt: new Date(
          Date.now() + longLivedToken.expires_in * 1000
        ),
        profilePictureUrl: profile.profile_picture_url,
        followersCount: profile.followers_count,
        followingCount: profile.follows_count,
        mediaCount: profile.media_count,
        isActive: true,
      },
    });

    return NextResponse.redirect(
      new URL("/integrations?success=instagram", req.nextUrl.origin)
    );
  } catch (err: unknown) {
    const error = err as any;
    console.error("Instagram callback error:", error);
    return NextResponse.redirect(
      new URL(`/integrations?error=${encodeURIComponent(error.message || "instagram_failed")}`, req.nextUrl.origin)
    );
  }
}
