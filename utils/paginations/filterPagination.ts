export const filterPagination = <T>(data: T & Pagination): Pagination => {
  return {
    count: data.count,
    links: data.links,
    page: data.page,
    pageSize: data.pageSize,
    totalCounts: data.totalCounts,
    totalPages: data.totalPages,
  };
};
