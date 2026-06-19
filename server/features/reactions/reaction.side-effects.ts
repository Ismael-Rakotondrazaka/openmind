import type { ReactionModel } from '#shared/features/reactions';

import { enqueueNotification } from '#server/features/notifications/notification.repository';

const REACTION_DELAY_MS = 5 * 60 * 1000;

export const onReactionCreated = async (
  reaction: ReactionModel
): Promise<void> => {
  const processAfter = new Date(Date.now() + REACTION_DELAY_MS);

  if (reaction.postId) {
    const post = await prisma.post.findFirst({
      include: { author: { select: { username: true } } },
      where: { deletedAt: null, id: reaction.postId },
    });

    if (!post) return;

    await enqueueNotification({
      actorId: reaction.userId,
      data: {
        post_author_username: post.author.username,
        post_id: post.id,
        post_slug: post.slug,
        reaction_type: reaction.type,
      },
      processAfter,
      recipientId: post.authorId,
      type: 'post_reacted',
    });
  } else if (reaction.commentId) {
    const comment = await prisma.comment.findFirst({
      include: {
        post: { include: { author: { select: { username: true } } } },
      },
      where: { deletedAt: null, id: reaction.commentId },
    });

    if (!comment) return;

    await enqueueNotification({
      actorId: reaction.userId,
      data: {
        comment_id: comment.id,
        post_author_username: comment.post.author.username,
        post_id: comment.post.id,
        post_slug: comment.post.slug,
        reaction_type: reaction.type,
      },
      processAfter,
      recipientId: comment.authorId,
      type: 'comment_reacted',
    });
  }
};
