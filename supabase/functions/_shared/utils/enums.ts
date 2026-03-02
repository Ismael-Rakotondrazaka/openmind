/**
 * Helper function to create const object from enum values
 */
export const createEnumConstants = <T extends readonly string[]>(values: T) => {
  return Object.fromEntries(values.map(value => [value, value])) as {
    [K in T[number] as K]: K;
  };
};
