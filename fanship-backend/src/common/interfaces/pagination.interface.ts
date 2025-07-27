export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResult<T> {
  list: T[];
  pagination: PaginationMeta;
}

export class PaginationHelper {
  static calculatePagination(
    totalItems: number,
    page: number = 1,
    limit: number = 20,
  ): PaginationMeta {
    const maxLimit = 100;
    const normalizedLimit = Math.min(limit, maxLimit);
    const normalizedPage = Math.max(page, 1);
    const totalPages = Math.ceil(totalItems / normalizedLimit);

    return {
      current_page: normalizedPage,
      total_pages: totalPages,
      total_items: totalItems,
      limit: normalizedLimit,
      has_next: normalizedPage < totalPages,
      has_prev: normalizedPage > 1,
    };
  }

  static getSkipAndTake(page: number = 1, limit: number = 20): { skip: number; take: number } {
    const maxLimit = 100;
    const normalizedLimit = Math.min(limit, maxLimit);
    const normalizedPage = Math.max(page, 1);
    const skip = (normalizedPage - 1) * normalizedLimit;

    return {
      skip,
      take: normalizedLimit,
    };
  }
} 