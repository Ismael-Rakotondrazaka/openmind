import type { PrismaClient } from '../../prisma/generated/client/client.js';

export const seedCounters = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    include: {
      followedBy: true,
      following: true,
      posts: { where: { deletedAt: null } },
    },
  });
  for (const user of users) {
    await prisma.user.update({
      data: {
        followerCount: user.followedBy.length,
        followingCount: user.following.length,
        postsCount: user.posts.length,
      },
      where: { id: user.id },
    });
  }

  const posts = await prisma.post.findMany({
    include: {
      comments: { where: { deletedAt: null } },
      reactions: true,
      views: true,
    },
  });
  for (const post of posts) {
    const details: Record<string, number> = {};
    for (const r of post.reactions) {
      details[r.type] = (details[r.type] ?? 0) + 1;
    }
    await prisma.post.update({
      data: {
        commentsCount: post.comments.length,
        reactionsCount: post.reactions.length,
        reactionsDetails: details,
        viewsCount: post.views.length,
      },
      where: { id: post.id },
    });
  }

  const comments = await prisma.comment.findMany({
    include: { reactions: true },
  });
  for (const comment of comments) {
    const details: Record<string, number> = {};
    for (const r of comment.reactions) {
      details[r.type] = (details[r.type] ?? 0) + 1;
    }
    await prisma.comment.update({
      data: {
        reactionsCount: comment.reactions.length,
        reactionsDetails: details,
      },
      where: { id: comment.id },
    });
  }
};
