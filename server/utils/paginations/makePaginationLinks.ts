import qs from "qs";
import type { EventHandlerRequest, H3Event } from "h3";
import type { PaginationLinks } from "~/utils";

export const makePaginationLinks = (
  event: H3Event<EventHandlerRequest>,
  currentPage: number,
  totalPages: number,
  pageSize: number,
): PaginationLinks => {
  const url: URL = getRequestURL(event);
  const queryString = url.search;
  const parsedQuery: qs.ParsedQs = qs.parse(queryString, {
    ignoreQueryPrefix: true,
  });

  parsedQuery.pageSize = `${pageSize}`;

  const makeCurrentLink = () => {
    parsedQuery.page = `${currentPage}`;

    return `${url.pathname}?${qs.stringify(parsedQuery)}`;
  };

  const makePreviousLink = () => {
    parsedQuery.page = `${currentPage - 1}`;

    return `${url.pathname}?${qs.stringify(parsedQuery)}`;
  };

  const makeNextLink = () => {
    parsedQuery.page = `${currentPage + 1}`;

    return `${url.pathname}?${qs.stringify(parsedQuery)}`;
  };

  const links: PaginationLinks = {
    current: makeCurrentLink(),
    previous: currentPage > 1 ? makePreviousLink() : null,
    next: currentPage < totalPages ? makeNextLink() : null,
  };

  return links;
};
