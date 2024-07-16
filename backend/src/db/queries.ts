import type { SelectQueryBuilder } from 'typeorm';

export type PaginatedQueryParams<T> = T & {
  ipp?: number;
  page?: number;
  withTotalCount?: boolean;
};

export type PaginatedQueryResult<T> = {
  ipp: number;
  page: number;
  items: T[];
  totalCount?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const defaultPaginatedQueryParams = {
  ipp: 50,
  page: 1,
  withTotalCount: false,
} as const;

export async function resolvePaginatedQuery<T>(
  query: SelectQueryBuilder<T>,
  params: PaginatedQueryParams<unknown>
): Promise<PaginatedQueryResult<T>> {
  const page = params.page || defaultPaginatedQueryParams.page;
  const ipp = params.ipp || defaultPaginatedQueryParams.ipp;
  const offset = (page - 1) * ipp;

  const paginatedQuery = query
    .skip(offset)
    .take(params.withTotalCount ? ipp : ipp + 1);

  if (!params.withTotalCount) {
    const items = await paginatedQuery.getMany();
    const hasNextPage = items.length > ipp;

    if (hasNextPage) {
      items.pop();
    }

    return {
      ipp,
      page,
      items,
      hasNextPage,
      hasPreviousPage: offset > 0,
    };
  }

  const [items, totalCount] = await paginatedQuery.getManyAndCount();
  return {
    ipp,
    page,
    items,
    totalCount,
    hasNextPage: offset + items.length < totalCount,
    hasPreviousPage: page > 1,
  };
}
