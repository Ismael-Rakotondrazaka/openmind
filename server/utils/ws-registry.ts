import type { Peer } from 'crossws';

const topicPeers = new Map<string, Set<Peer>>();

export const wsRegistry = {
  addPeer(topic: string, peer: Peer) {
    if (!topicPeers.has(topic)) topicPeers.set(topic, new Set());
    topicPeers.get(topic)!.add(peer);
  },
  broadcast(topic: string, data: unknown) {
    const msg = JSON.stringify(data);
    topicPeers.get(topic)?.forEach(p => p.send(msg));
  },
  removePeer(topic: string, peer: Peer) {
    topicPeers.get(topic)?.delete(peer);
  },
  removePeerFromAll(peer: Peer) {
    for (const peers of topicPeers.values()) peers.delete(peer);
  },
};
