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

export const createHTML = (): Article["content"] => {
  type ElementTag = "p" | "h1" | "h2" | "ul" | "ol" | "img";

  const elementTags: ElementTag[] = [
    ...faker.helpers.multiple<ElementTag>(() => "p", {
      count: {
        min: 7,
        max: 30,
      },
    }),
  ];

  faker.helpers.maybe(
    () => {
      elementTags.push(
        ...faker.helpers.multiple<ElementTag>(() => "h1", {
          count: {
            min: 1,
            max: 3,
          },
        }),
      );
    },
    {
      probability: 0.8,
    },
  );

  faker.helpers.maybe(() => {
    elementTags.push(
      ...faker.helpers.multiple<ElementTag>(() => "ul", {
        count: {
          min: 1,
          max: 3,
        },
      }),
    );
  });

  faker.helpers.maybe(() => {
    elementTags.push(
      ...faker.helpers.multiple<ElementTag>(() => "ol", {
        count: {
          min: 1,
          max: 3,
        },
      }),
    );
  });

  faker.helpers.maybe(() => {
    elementTags.push(
      ...faker.helpers.multiple<ElementTag>(() => "img", {
        count: {
          min: 1,
          max: 3,
        },
      }),
    );
  });

  const createListItems = (): string[] => {
    return faker.helpers.multiple(
      () =>
        `<li>${faker.lorem.words({
          min: 3,
          max: 7,
        })}</li>`,
    );
  };

  const makers: Record<ElementTag, () => string> = {
    h1: () => `<h1>${faker.lorem.sentence()}</h1>`,
    h2: () => `<h2>${faker.lorem.sentence()}</h2>`,
    img: () => `<img src="${createIllustrationUrl()}"/>`,
    ol: () => `<ol>${createListItems().join("")}</ol>`,
    ul: () => `<ul>${createListItems().join("")}</ul>`,
    p: () => `<p>${faker.lorem.paragraph()}</p>`,
  };
  const shuffledElementTags: ElementTag[] = faker.helpers.shuffle(elementTags);

  const data: string[] = shuffledElementTags.map((tag: ElementTag) => {
    const maker: () => string = makers[tag];
    return maker();
  });

  const result: string = faker.helpers.shuffle(data).join("");

  return result;
};
