import { NextRequest, NextResponse } from "next/server";
import { processGitHubAutoPosts } from "@/services/github-autopost.service";

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In development, allow bypass if no cron secret is set, otherwise reject
      if (process.env.NODE_ENV === "production" || authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const results = await processGitHubAutoPosts();

    return NextResponse.json({
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Cron GitHub auto-post error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
