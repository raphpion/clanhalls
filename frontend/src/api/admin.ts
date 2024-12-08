import {
  get,
  post,
  type PaginatedQueryParams,
  type PaginatedQueryResult,
} from '.';

export type AdminQueryUsersParams = PaginatedQueryParams<{
  search: string;
  orderBy: {
    field: 'username' | 'email' | 'enabled' | 'isSuperAdmin';
    order: 'ASC' | 'DESC';
  };
}>;

export type AdminListUsersData = {
  googleId: string;
  username: string | null;
  email: string;
  pictureUrl: string | null;
  enabled: boolean;
  isSuperAdmin: boolean;
};

export async function adminQueryUsers(
  params: AdminQueryUsersParams,
): Promise<PaginatedQueryResult<AdminListUsersData>> {
  const searchParams = new URLSearchParams();
  searchParams.append('search', params.search);
  searchParams.append('orderBy', params.orderBy.field);
  searchParams.append('order', params.orderBy.order);
  searchParams.append('ipp', String(params.ipp));
  searchParams.append('page', String(params.page));

  const response = await get<PaginatedQueryResult<AdminListUsersData>>(
    `/api/admin/users?${searchParams.toString()}`,
  );
  return response.data;
}

export async function disableUser(googleId: string) {
  return post(`/api/admin/users/${googleId}/disable`);
}

export async function enableUser(googleId: string) {
  return post(`/api/admin/users/${googleId}/enable`);
}

export async function signOutAllUserSessions(googleId: string) {
  return post(`/api/admin/users/${googleId}/sign-out-all`);
}
