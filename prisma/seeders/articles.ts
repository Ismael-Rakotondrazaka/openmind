import { faker } from "@faker-js/faker";
import { PrismaClient, type User } from "@prisma/client";
import slugify from "slugify";
import { createIdentifier, createIllustrationUrl } from "./commons";
import { articleConfig } from "~/configs";

const createId = (): Article["id"] => {
  return createIdentifier(articleConfig.ID_LENGTH);
};

const createTitle = (): Article["title"] => {
  return faker.lorem.sentence({
    min: 3,
    max: 7,
  });
};

const createSlug = (raw: string): Article["slug"] => {
  return slugify(raw, {
    lower: true,
    trim: true,
  });
};

const createSummary = (): Article["summary"] => {
  return (
    faker.helpers.maybe(() => {
      return faker.lorem.sentences({
        min: 1,
        max: 3,
      });
    }) ?? null
  );
};

const createCoverUrl = (): Article["coverUrl"] => {
  return (
    faker.helpers.maybe(() => {
      return createIllustrationUrl();
    }) ?? null
  );
};

const createIsVisible = (): Article["isVisible"] => {
  return (
    faker.helpers.maybe(() => true, {
      probability: 0.9,
    }) ?? false
  );
};

const createContent = (): Article["content"] => {
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

const createArticle = (payload: {
  prisma: PrismaClient;
  user: User;
}): Promise<Article> => {
  const { prisma, user } = payload;

  const createdAt: Date = faker.date.future({
    years: 2,
    refDate: user.createdAt,
  });

  const updatedAt: Date =
    faker.helpers.maybe(
      () => {
        return faker.date.soon({
          days: 30,
          refDate: createdAt,
        });
      },
      {
        probability: 0.1,
      },
    ) ?? createdAt;

  const title: string = createTitle();

  const slug: string = createSlug(title);

  return prisma.article.create({
    data: {
      id: createId(),
      slug,
      title,
      coverUrl: createCoverUrl(),
      content: createContent(),
      summary: createSummary(),
      isVisible: createIsVisible(),
      userId: user.id,
      createdAt,
      updatedAt,
    },
  });
};

export const createArticles = (payload: {
  prisma: PrismaClient;
  users: User[];
}): Promise<Article[]> => {
  const { prisma, users } = payload;

  return Promise.all(
    users.flatMap((user: User) =>
      faker.helpers.multiple(
        () =>
          createArticle({
            prisma,
            user,
          }),
        {
          count: {
            min: 0,
            max: 10,
          },
        },
      ),
    ),
  );
};
