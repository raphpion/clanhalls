import { isAbsoluteURL } from './helpers';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export type ApiResult<TResult> = {
  data: TResult;
  status: number;
};

export type ApiError = {
  data?: unknown;
  status: number;
};

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

async function execute<TData, TResult>(
  method: Request['method'],
  url: string,
  data?: TData,
): Promise<ApiResult<TResult>> {
  const headers = new Headers();
  let body: string | undefined;

  if (data) {
    body = JSON.stringify(data);
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  const input = isAbsoluteURL(url) ? url : new URL(url, apiBaseUrl);

  let result: unknown;
  const response = await fetch(input, {
    method,
    headers,
    body,
    credentials: 'include',
  });
  const resultType = response.headers.get('Content-Type');

  if (resultType) {
    if (resultType.includes('json')) {
      result = await response.json();
    } else if (resultType.includes('text')) {
      result = await response.text();
    } else {
      throw new Error(`The content type "${resultType}" is not supported.`);
    }
  }

  if (!response.ok) {
    const error: ApiError = { status: response.status, data: result };
    throw error;
  }

  return { data: result as TResult, status: response.status };
}

export async function _delete<TResult = unknown>(url: string) {
  return execute<never, TResult>('DELETE', url);
}

export async function get<TResult = unknown>(url: string) {
  return await execute<never, TResult>('GET', url);
}

export async function post<TData, TResult = unknown>(
  url: string,
  data?: TData,
) {
  return await execute<TData, TResult>('POST', url, data);
}

export async function put<TData, TResult = unknown>(url: string, data?: TData) {
  return await execute<TData, TResult>('PUT', url, data);
}
