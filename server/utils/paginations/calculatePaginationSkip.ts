// Calculate pagination skip
export const calculatePaginationSkip = (
  currentPage: number,
  pageSize: number,
): number => (currentPage - 1) * pageSize;
