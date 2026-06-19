import type { Serialize as NitroPackSerialize } from 'nitropack';

export type MaybeSerialize<T> = Serialize<T> | T;

export type Serialize<T> = NitroPackSerialize<T>;
