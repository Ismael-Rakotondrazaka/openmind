import slugifyLib from "slugify";

export const slugify = (raw: string): string =>
  slugifyLib(raw, {
    lower: true,
  });
