export interface Request<
  TData = Record<string, never>,
  TBody = Record<string, never>,
  TParams extends Record<string, never | number | string> = Record<
    string,
    never
  >,
  TQuery = Record<string, never>,
> {
  input: {
    body: TBody;
    params: TParams;
    query: TQuery;
  };
  output: Promise<TData>;
}

export type RequestToWSEvent<
  TEventName extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRequest extends Request<any, any, any, any>,
> = {
  eventName: TEventName;
} & Awaited<TRequest['output']>;

export type RequestToWSMessage<
  TEventName extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRequest extends Request<any, any, any, any>,
> = WSMessage<
  TEventName,
  TRequest['input']['body'],
  TRequest['input']['params'],
  TRequest['input']['query']
>;

export interface WSMessage<
  TEventName extends string,
  TBody = Record<string, never>,
  TParams extends Record<string, never | number | string> = Record<
    string,
    never
  >,
  TQuery = Record<string, never>,
> {
  body: TBody;
  eventName: TEventName;
  params: TParams;
  query: TQuery;
}
