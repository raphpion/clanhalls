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

  let result: unknown;
  const response = await fetch(url, {
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
    if (url.startsWith('/api/')) {
      const error: ApiError = { status: response.status, data: result };

      // TODO: find a better way to handle this
      if ([401, 403].includes(error.status)) {
        window.location.reload();
      }

      throw error;
    }

    throw new Error(response.statusText);
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

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as ApiError).status === 'number'
  );
}
