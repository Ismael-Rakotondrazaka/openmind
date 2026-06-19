export const WsEvent = Object.freeze({
  DELETE: 'DELETE',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
} as const);

export type WsEvent = (typeof WsEvent)[keyof typeof WsEvent];

export const WsControl = Object.freeze({
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
} as const);

export type WsControl = (typeof WsControl)[keyof typeof WsControl];
