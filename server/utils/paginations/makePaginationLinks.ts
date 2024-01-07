import type { EventHandlerRequest, H3Event } from "h3";
import { withQuery } from "ufo";
import type { PaginationLinks } from "~/utils";

export const makePaginationLinks = (
  event: H3Event<EventHandlerRequest>,
  currentPage: number,
  totalPages: number,
  pageSize: number,
): PaginationLinks => {
  const url: URL = getRequestURL(event);
  const query = getQuery(event);

  query.pageSize = pageSize;

  const makeCurrentLink = () =>
    withQuery(url.pathname, {
      ...query,
      page: currentPage,
    });

  const makePreviousLink = () =>
    withQuery(url.pathname, {
      ...query,
      page: currentPage - 1,
    });

  const makeNextLink = () =>
    withQuery(url.pathname, {
      ...query,
      page: currentPage + 1,
    });

  const links: PaginationLinks = {
    current: makeCurrentLink(),
    previous: currentPage > 1 ? makePreviousLink() : null,
    next: currentPage < totalPages ? makeNextLink() : null,
  };

  return links;
};
