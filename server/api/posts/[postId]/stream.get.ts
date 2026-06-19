import { createEventStream } from 'h3';

// SSE endpoint kept for reference — superseded by WebSocket at /ws
export default defineEventHandler(async event => {
  const stream = createEventStream(event);
  stream.onClosed(async () => {
    await stream.close();
  });
  return stream.send();
});
