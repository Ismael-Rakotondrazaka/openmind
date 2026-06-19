/* eslint-disable @typescript-eslint/no-explicit-any */
export type Flatten<T extends GenericObject> = {
  [P in FlattenedPath<T>]: PathValue<T, P>;
};

export type FlattenedPath<T> = T extends any ? PathInternal<T> : never;

type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never;

type ArrayKey = number;

type ArrayPath<T> = T extends any ? ArrayPathInternal<T> : never;

type ArrayPathImpl<K extends number | string, V, TraversedTypes> = V extends
  | BrowserNativeObject
  | Primitive
  ? IsAny<V> extends true
    ? string
    : never
  : V extends ReadonlyArray<infer U>
    ? U extends BrowserNativeObject | Primitive
      ? IsAny<V> extends true
        ? string
        : never
      : true extends AnyIsEqual<TraversedTypes, V>
        ? never
        : `${K}.${ArrayPathInternal<V, TraversedTypes | V>}` | `${K}`
    : true extends AnyIsEqual<TraversedTypes, V>
      ? never
      : `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`;

type ArrayPathInternal<T, TraversedTypes = T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
          [K in TupleKeys<T>]-?: ArrayPathImpl<
            K & string,
            T[K],
            TraversedTypes
          >;
        }[TupleKeys<T>]
      : ArrayPathImpl<ArrayKey, V, TraversedTypes>
    : {
        [K in keyof T]-?: ArrayPathImpl<K & string, T[K], TraversedTypes>;
      }[keyof T];

type BrowserNativeObject = Date | File | FileList;

type GenericObject = {
  [x: string]: any;
};

type IsAny<T> = 0 extends 1 & T ? true : false;

type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;

type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
  ? false
  : true;

type PathImpl<K extends number | string, V, TraversedTypes> = V extends
  | BrowserNativeObject
  | Primitive
  ? `${K}`
  : true extends AnyIsEqual<TraversedTypes, V>
    ? `${K}`
    : `${K}.${PathInternal<V, TraversedTypes | V>}` | `${K}`;

type PathInternal<T, TraversedTypes = T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
          [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>;
        }[TupleKeys<T>]
      : PathImpl<ArrayKey, V, TraversedTypes>
    : {
        [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
      }[keyof T];

type PathValue<T, P extends ArrayPath<T> | FlattenedPath<T>> = T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends FlattenedPath<T[K]>
        ? PathValue<T[K], R>
        : never
      : K extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? PathValue<V, FlattenedPath<V> & R>
          : never
        : never
    : P extends keyof T
      ? T[P]
      : P extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? V
          : never
        : never
  : never;

type Primitive = bigint | boolean | null | number | string | symbol | undefined;

type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
