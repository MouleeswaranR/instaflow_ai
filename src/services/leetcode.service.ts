if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

interface LeetCodeProfile {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  streak: number;
}

interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export async function fetchLeetCodeProfile(
  username: string
): Promise<LeetCodeProfile> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
        }
      }
      userContestRanking(username: $username) {
        rating
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode API error: ${response.statusText}`);
  }

  const data = await response.json();
  const user = data.data?.matchedUser;

  if (!user) throw new Error(`User ${username} not found on LeetCode`);

  const stats = user.submitStatsGlobal?.acSubmissionNum || [];
  const getCount = (diff: string) =>
    stats.find((s: { difficulty: string; count: number }) => s.difficulty === diff)?.count || 0;

  return {
    username: user.username,
    totalSolved: getCount("All"),
    easySolved: getCount("Easy"),
    mediumSolved: getCount("Medium"),
    hardSolved: getCount("Hard"),
    contestRating: Math.round(data.data?.userContestRanking?.rating || 0),
    streak: user.userCalendar?.streak || 0,
  };
}

export async function fetchRecentSubmissions(
  username: string,
  limit = 10
): Promise<RecentSubmission[]> {
  const query = `
    query getRecentSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username, limit },
    }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data?.recentAcSubmissionList || [];
}
