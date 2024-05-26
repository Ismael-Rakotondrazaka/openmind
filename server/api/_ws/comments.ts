import destr from "destr";
import { getQuery } from "ufo";
import { commentRepository } from "~/repositories";
import { WSCommentBodySchema, WSCommentQuerySchema, WSConfig } from "~/utils";

export default defineWebSocketHandler({
  open(peer) {
    const spr = WSCommentQuerySchema.safeParse(getQuery(peer.url));

    if (!spr.success) return;

    peer.subscribe(`articles:${spr.data.articleId}`);
  },

  async message(peer, message) {
    if (message.text() === WSConfig.PING_DEFAULT_VALUE) {
      peer.send(WSConfig.PONG_DEFAULT_VALUE);
      return;
    }

    try {
      const bodySpr = WSCommentBodySchema.safeParse(destr(message.text()));

      if (!bodySpr.success) return;

      const comment = await commentRepository.findFullOne({
        where: {
          id: bodySpr.data.commentId,
          userId: bodySpr.data.userId,
          deletedAt:
            bodySpr.data.eventType !== "destroy"
              ? null
              : {
                  not: null,
                },
        },
        authUser: null,
      });

      if (comment === null) return;

      const data: WSCommentData = {
        comment,
        eventType: bodySpr.data.eventType,
      };

      // peer.send(data);
      peer.publish(`articles:${comment.articleId}`, data);
    } catch (_error) {
      return;
    }
  },

  close(peer) {
    peer._subscriptions.forEach((value) => {
      peer.unsubscribe(value);
    });
  },
});
