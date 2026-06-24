import { prisma } from "@/lib/prisma";
import {
  createMediaContainer,
  createCarouselContainer,
  publishMedia,
} from "@/lib/instagram";

interface PublishOptions {
  postId: string;
  userId: string;
}

export async function publishPost(options: PublishOptions) {
  const { postId, userId } = options;

  // Get the post with all related data
  const post = await prisma.post.findUnique({
    where: { id: postId, userId },
    include: {
      captions: { where: { selected: true } },
      hashtagSets: { where: { selected: true } },
      generatedImages: { where: { isSelected: true } },
      carouselSlides: { orderBy: { slideNumber: "asc" } },
    },
  });

  if (!post) throw new Error("Post not found");

  // Get the user's Instagram account
  const igAccount = await prisma.instagramAccount.findFirst({
    where: { userId, isActive: true },
  });

  if (!igAccount) throw new Error("No Instagram account connected");

  // Build caption with hashtags
  const caption = post.captions[0]?.content || post.title;
  const hashtags = post.hashtagSets[0]?.hashtags.join(" ") || "";
  const fullCaption = `${caption}\n\n${hashtags}`;

  let instagramPostId: string;

  if (post.layout === "CAROUSEL" && post.carouselSlides.length > 0) {
    // Create carousel child containers
    const childIds: string[] = [];
    const fallbackImages = [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1080&auto=format&fit=crop"
    ];
    
    for (let i = 0; i < post.carouselSlides.length; i++) {
      const slide = post.carouselSlides[i];
      const imageUrl = slide.imageUrl || fallbackImages[i % 2];
      
      const childId = await createMediaContainer(
        igAccount.accessToken,
        igAccount.instagramUserId,
        { imageUrl: imageUrl }
      );
      childIds.push(childId);
    }

    // Create carousel container
    const containerId = await createCarouselContainer(
      igAccount.accessToken,
      igAccount.instagramUserId,
      childIds,
      fullCaption
    );

    // Wait for processing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Publish
    instagramPostId = await publishMedia(
      igAccount.accessToken,
      igAccount.instagramUserId,
      containerId
    );
  } else {
    // Single image post
    const image = post.generatedImages[0];
    const imageUrl = image?.cloudinaryUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1080&auto=format&fit=crop";

    const containerId = await createMediaContainer(
      igAccount.accessToken,
      igAccount.instagramUserId,
      { imageUrl: imageUrl, caption: fullCaption }
    );

    // Wait for processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Publish
    instagramPostId = await publishMedia(
      igAccount.accessToken,
      igAccount.instagramUserId,
      containerId
    );
  }

  // Update post status
  await prisma.post.update({
    where: { id: postId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
      instagramPostId,
    },
  });

  return { instagramPostId };
}

export async function publishScheduledPosts() {
  const now = new Date();

  const duePosts = await prisma.scheduledPost.findMany({
    where: {
      isActive: true,
      scheduledAt: { lte: now },
      post: { status: { in: ["GENERATED", "SCHEDULED"] } },
    },
    include: {
      post: true,
    },
  });

  const results = [];

  for (const scheduled of duePosts) {
    try {
      await prisma.post.update({
        where: { id: scheduled.postId },
        data: { status: "PUBLISHING" },
      });

      const result = await publishPost({
        postId: scheduled.postId,
        userId: scheduled.userId,
      });

      // Handle recurring schedules
      if (scheduled.frequency !== "ONCE") {
        const nextRun = calculateNextRun(scheduled.scheduledAt, scheduled.frequency);
        await prisma.scheduledPost.update({
          where: { id: scheduled.id },
          data: {
            lastRunAt: now,
            nextRunAt: nextRun,
            scheduledAt: nextRun,
          },
        });
      } else {
        await prisma.scheduledPost.update({
          where: { id: scheduled.id },
          data: { isActive: false, lastRunAt: now },
        });
      }

      results.push({ postId: scheduled.postId, status: "published", ...result });
    } catch (error) {
      await prisma.post.update({
        where: { id: scheduled.postId },
        data: { status: "FAILED" },
      });
      results.push({
        postId: scheduled.postId,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

function calculateNextRun(
  currentDate: Date,
  frequency: string
): Date {
  const next = new Date(currentDate);
  switch (frequency) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
  }
  return next;
}
