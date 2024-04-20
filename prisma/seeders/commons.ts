import { faker } from "@faker-js/faker";
import { customAlphabet } from "nanoid";

export const createIdentifier = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
);

export const createIllustrationUrl = (): string => {
  const width: number = faker.helpers.rangeToNumber({
    min: 50,
    max: 640,
  });

  const height: number = faker.helpers.rangeToNumber({
    min: 50,
    max: 480,
  });

  return faker.image.url({
    width,
    height,
  });
};
