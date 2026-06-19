import { wsRegistry } from '#server/utils/ws-registry';
import { notificationsTopic } from '#shared/features/notifications';
import { WsControl } from '#shared/utils/ws';

export default defineWebSocketHandler({
  close(peer) {
    wsRegistry.removePeerFromAll(peer);
  },

  message(peer, message) {
    const text = message.text();
    if (text === 'ping') {
      peer.send('pong');
      return;
    }
    try {
      const { topic, type } = JSON.parse(text) as { topic?: string; type: string };
      if (!topic) return;
      if (type === WsControl.SUBSCRIBE) wsRegistry.addPeer(topic, peer);
      else if (type === WsControl.UNSUBSCRIBE) wsRegistry.removePeer(topic, peer);
    } catch {
      // ignore malformed messages
    }
  },

  async open(peer) {
    const { user } = await requireUserSession(peer);
    wsRegistry.addPeer(notificationsTopic(user.id), peer);
  },

  async upgrade(request) {
    await requireUserSession(request);
  },
});
