if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

interface GitHubEvent {
  type: string;
  repo: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
}

export async function fetchGitHubActivity(
  accessToken: string,
  username: string
): Promise<GitHubEvent[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/events?per_page=30`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const events = await response.json();
  const significantEvents: GitHubEvent[] = [];

  for (const event of events) {
    switch (event.type) {
      case "PushEvent": {
        const commits = event.payload?.commits || [];
        if (commits.length > 0) {
          significantEvents.push({
            type: "commit",
            repo: event.repo?.name || "",
            title: `Pushed ${commits.length} commit${commits.length > 1 ? "s" : ""} to ${event.repo?.name}`,
            description: commits[0]?.message || "",
            url: `https://github.com/${event.repo?.name}`,
            createdAt: event.created_at,
          });
        }
        break;
      }
      case "PullRequestEvent": {
        const pr = event.payload?.pull_request;
        if (pr && event.payload?.action === "closed" && pr.merged) {
          significantEvents.push({
            type: "pull_request",
            repo: event.repo?.name || "",
            title: `Merged PR: ${pr.title}`,
            description: pr.body?.slice(0, 200) || "",
            url: pr.html_url || "",
            createdAt: event.created_at,
          });
        }
        break;
      }
      case "ReleaseEvent": {
        const release = event.payload?.release;
        if (release) {
          significantEvents.push({
            type: "release",
            repo: event.repo?.name || "",
            title: `Released ${release.tag_name} of ${event.repo?.name}`,
            description: release.body?.slice(0, 200) || "",
            url: release.html_url || "",
            createdAt: event.created_at,
          });
        }
        break;
      }
      case "CreateEvent": {
        if (event.payload?.ref_type === "repository") {
          significantEvents.push({
            type: "new_repo",
            repo: event.repo?.name || "",
            title: `Created new repository: ${event.repo?.name}`,
            description: event.payload?.description || "New project launched!",
            url: `https://github.com/${event.repo?.name}`,
            createdAt: event.created_at,
          });
        }
        break;
      }
    }
  }

  return significantEvents;
}

export async function fetchGitHubProfile(
  accessToken: string
): Promise<{ username: string; name: string; avatarUrl: string; publicRepos: number; followers: number }> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    username: data.login,
    name: data.name || data.login,
    avatarUrl: data.avatar_url,
    publicRepos: data.public_repos,
    followers: data.followers,
  };
}

export async function calculateGitHubStreak(
  accessToken: string,
  username: string
): Promise<number> {
  // Fetch up to 100 recent events
  const response = await fetch(
    `https://api.github.com/users/${username}/events?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    return 0; // fallback gracefully
  }

  const events = await response.json();
  const pushDates = new Set<string>();

  for (const event of events) {
    if (event.type === "PushEvent" || event.type === "PullRequestEvent" || event.type === "CreateEvent") {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      pushDates.add(date);
    }
  }

  // Calculate streak
  let currentStreak = 0;
  let currentDate = new Date();
  
  // Also check yesterday to allow the streak to be active if they haven't committed today yet
  let checkDate = new Date();
  const todayStr = checkDate.toISOString().split("T")[0];
  
  checkDate.setDate(checkDate.getDate() - 1);
  const yesterdayStr = checkDate.toISOString().split("T")[0];

  let streakActive = pushDates.has(todayStr) || pushDates.has(yesterdayStr);
  
  if (!streakActive) {
    return 0;
  }

  // Start from today and go backwards
  checkDate = new Date();
  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (pushDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dateStr === todayStr && pushDates.has(yesterdayStr)) {
      // Haven't committed today yet, but committed yesterday. Streak is still alive!
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
}
