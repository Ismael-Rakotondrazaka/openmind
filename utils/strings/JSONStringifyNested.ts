export const JSONStringifyNested = (
  object: Record<string, unknown>,
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = JSON.stringify(object[key]);
    }
  }

  return result;
};
