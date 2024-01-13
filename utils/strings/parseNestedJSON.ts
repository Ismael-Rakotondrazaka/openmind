import { destr } from "destr";

export const parseNestedJSON = (
  object: Record<string, unknown>,
): Record<string, unknown> => {
  const nestedParsed: Record<string, unknown> = {};

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      nestedParsed[key] = destr(object[key]);
    }
  }

  return nestedParsed;
};
