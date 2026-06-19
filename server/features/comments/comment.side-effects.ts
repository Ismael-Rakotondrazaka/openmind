import type { CommentModel } from '#shared/features/comments';

import { enqueueNotification } from '#server/features/notifications/notification.repository';
import { wsRegistry } from '#server/utils/ws-registry';
import {
  commentsTopic,
  WsCommentMessageType,
} from '#shared/features/comments';
import { WsEvent } from '#shared/utils/ws';

import { getCommentWithAuthor } from './comment.service';

const broadcastCommentCreated = async (
  comment: CommentModel
): Promise<void> => {
  const commentWithAuthor = await getCommentWithAuthor(comment.id);
  if (!commentWithAuthor) return;
  wsRegistry.broadcast(commentsTopic(comment.postId), {
    event: WsEvent.INSERT,
    record: commentWithAuthor,
    type: WsCommentMessageType,
  });
};

const enqueueCommentNotifications = async (
  comment: CommentModel
): Promise<void> => {
  const post = await prisma.post.findFirst({
    include: { author: { select: { username: true } } },
    where: { deletedAt: null, id: comment.postId },
  });

  if (!post) return;

  const baseData = {
    comment_id: comment.id,
    post_author_username: post.author.username,
    post_id: post.id,
    post_slug: post.slug,
  };

  if (!comment.parentId) {
    await enqueueNotification({
      actorId: comment.authorId,
      data: baseData,
      recipientId: post.authorId,
      type: 'post_commented',
    });
    return;
  }

  const parent = await prisma.comment.findFirst({
    where: { deletedAt: null, id: comment.parentId },
  });

  if (parent) {
    await enqueueNotification({
      actorId: comment.authorId,
      data: { ...baseData, parent_comment_id: comment.parentId },
      recipientId: parent.authorId,
      type: 'comment_replied',
    });

    if (post.authorId !== parent.authorId) {
      await enqueueNotification({
        actorId: comment.authorId,
        data: baseData,
        recipientId: post.authorId,
        type: 'post_commented',
      });
    }
  }
};

export const onCommentCreated = async (comment: CommentModel): Promise<void> => {
  await Promise.allSettled([
    broadcastCommentCreated(comment),
    enqueueCommentNotifications(comment),
  ]);
};
