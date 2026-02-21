export const seedConfig = {
  commentsPerPost: { max: 5, min: 0 },
  followsPerUser: { max: 4, min: 0 },
  reactionsPerComment: { max: 3, min: 0 },
  reactionsPerPost: { max: 6, min: 0 },
  repliesPerComment: { max: 2, min: 0 },
  savedPostsPerUser: { max: 5, min: 0 },
  seed: 42,
  userTagsPerUser: { max: 4, min: 1 },
  viewsPerPost: { max: 8, min: 0 },
} as const;

export type SeedConfig = typeof seedConfig;
