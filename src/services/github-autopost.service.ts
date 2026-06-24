import { prisma } from "@/lib/prisma";
import { fetchGitHubActivity } from "./github.service";
import { generateGroqJSON } from "@/lib/gemini";
import { generatePostImage } from "./image.service";

export async function processGitHubAutoPosts() {
  console.log("Starting GitHub Auto-Post processing...");
  const integrations = await prisma.gitHubIntegration.findMany({
    where: { autoPost: true },
    include: { user: true },
  });

  const results = [];

  for (const integration of integrations) {
    try {
      const events = await fetchGitHubActivity(
        integration.accessToken,
        integration.githubUsername
      );

      if (events.length === 0) continue;

      // Find the first valid event that is new
      const newestEvent = events.find(e => 
        (e.type === "commit" || e.type === "new_repo" || e.type === "release")
      );

      if (!newestEvent) continue;

      // Create a unique hash/ID for the event based on timestamp and repo
      const eventId = `${newestEvent.type}-${newestEvent.repo}-${newestEvent.createdAt}`;

      if (integration.lastProcessedEventId === eventId) {
        console.log(`Skipping: Already processed event ${eventId} for user ${integration.userId}`);
        continue;
      }

      console.log(`Generating auto-post for new GitHub event: ${eventId}`);

      // 1. Generate Caption & Hashtags using Groq
      const prompt = `
        You are an expert social media manager. A developer just had the following activity on GitHub:
        Type: ${newestEvent.type}
        Title: ${newestEvent.title}
        Details: ${newestEvent.description}
        Repo: ${newestEvent.repo}

        Create a short, engaging Instagram caption celebrating this. Also generate 5 highly relevant hashtags.
        Respond ONLY in this JSON format:
        {
          "caption": "The caption here...",
          "hashtags": ["#tag1", "#tag2"]
        }
      `;

      interface GroqResponse { caption: string; hashtags: string[] }
      const aiResponse = await generateGroqJSON<GroqResponse>(prompt);

      // 2. Generate Image
      const imageResult = await generatePostImage({
        title: newestEvent.title,
        description: newestEvent.description || `Updates to ${newestEvent.repo}`,
        category: "CODING",
        theme: "developer",
        template: "coding-progress",
        width: 1080,
        height: 1080,
      });

      if (!imageResult) {
        throw new Error("Failed to generate image for auto-post");
      }

      // 3. Create the Post in the database
      const post = await prisma.post.create({
        data: {
          userId: integration.userId,
          title: newestEvent.title,
          description: newestEvent.description || "GitHub Auto Post",
          category: "CODING",
          status: "SCHEDULED",
          layout: "SINGLE",
          theme: "developer",
          captions: {
            create: [
              {
                type: "PROFESSIONAL",
                content: aiResponse.caption,
                selected: true,
              }
            ]
          },
          hashtagSets: {
            create: [
              {
                type: "TRENDING",
                hashtags: aiResponse.hashtags,
                selected: true,
              }
            ]
          },
          generatedImages: {
            create: [
              {
                cloudinaryUrl: imageResult.url,
                publicId: imageResult.publicId,
                template: imageResult.template,
                theme: imageResult.theme,
                width: imageResult.width,
                height: imageResult.height,
                isSelected: true,
              }
            ]
          },
          scheduledPost: {
            create: {
              userId: integration.userId,
              // Schedule for 5 minutes from now to give the system time, then the publish cron will pick it up
              scheduledAt: new Date(Date.now() + 5 * 60 * 1000), 
            }
          }
        }
      });

      // 4. Update the integration
      await prisma.gitHubIntegration.update({
        where: { id: integration.id },
        data: { lastProcessedEventId: eventId },
      });

      results.push({
        userId: integration.userId,
        postId: post.id,
        eventId,
      });

    } catch (error) {
      console.error(`Error processing GitHub auto-post for user ${integration.userId}:`, error);
    }
  }

  return results;
}
