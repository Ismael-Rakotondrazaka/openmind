import { getQuery, parseURL, type QueryObject, withQuery } from 'ufo';

export class PaginationLinks {
  current: string;
  first: string;
  last: string;
  next: null | string;
  previous: null | string;

  constructor(arg: {
    page: number;
    pageSize: number;
    path: string;
    totalCount: number;
    totalPages: number;
  }) {
    const { page, pageSize, path, totalCount, totalPages } = arg;

    const parsedUrl = parseURL(path);
    const query: QueryObject = getQuery(parsedUrl.search);

    query.pageSize = pageSize;

    const makeFirstLink = () =>
      withQuery(parsedUrl.pathname, {
        ...query,
        page: 1,
      });

    const makeLastLink = () =>
      withQuery(parsedUrl.pathname, {
        ...query,
        page: Math.ceil(totalCount / pageSize),
      });

    const makeCurrentLink = () =>
      withQuery(parsedUrl.pathname, {
        ...query,
        page: page,
      });

    const makePreviousLink = () =>
      withQuery(parsedUrl.pathname, {
        ...query,
        page: page - 1,
      });

    const makeNextLink = () =>
      withQuery(parsedUrl.pathname, {
        ...query,
        page: page + 1,
      });

    this.current = makeCurrentLink();
    this.last = makeLastLink();
    this.first = makeFirstLink();
    this.previous = page > 1 ? makePreviousLink() : null;
    this.next = page < totalPages ? makeNextLink() : null;
  }
}

export class Pagination {
  readonly links: PaginationLinks;
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly totalPages: number;
  public get offset(): number {
    return (this.page - 1) * this.pageSize;
  }

  #path: string;

  constructor(arg: {
    page: number;
    pageSize: number;
    path: string;
    totalCount: number;
  }) {
    this.totalCount = arg.totalCount;
    this.page = arg.page;
    this.pageSize = arg.pageSize;
    this.totalPages = Math.ceil(arg.totalCount / arg.pageSize);
    this.#path = arg.path;

    this.links = new PaginationLinks({
      page: this.page,
      pageSize: this.pageSize,
      path: this.#path,
      totalCount: this.totalCount,
      totalPages: this.totalPages,
    });
  }
}

export function buildPagination(filters: { page?: number; pageSize?: number }) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
