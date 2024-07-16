import type { PaginatedQueryParams, PaginatedQueryResult } from '.';
import { _delete, get, post } from '.';

export type AccountData = {
  googleId: string;
  username?: string;
  email: string;
  emailNormalized: string;
  emailVerified: boolean;
} | null;

export type ClanPlayerQueryData = {
  uuid: string;
  username: string;
  rank: string;
  title: string | undefined;
  lastSeenAt: string;
};

export type ClanPlayerQueryParams = PaginatedQueryParams<{
  search: string;
  orderBy: {
    field: 'username' | 'rank' | 'lastSeenAt';
    order: 'ASC' | 'DESC';
  };
}>;

export type CreateClanPayload = {
  name: string;
};

export type CreateCredentialsPayload = {
  name: string;
  scope: string;
};

export type CreateCredentialsData = {
  clientId: string;
  clientSecret: string;
};

export type CredentialsData = {
  name: string;
  scope: string;
  clientId: string;
  createdAt: string;
  lastUsedAt: string | null;
};

export type ClanData = {
  uuid: string;
  name: string;
  isAdmin: boolean;
} | null;

export type SetUsernamePayload = {
  username: string;
};

export async function createClan(name: string): Promise<void> {
  await post<CreateClanPayload>('/account/clan', { name });
}

export async function getClan(): Promise<ClanData> {
  const response = await get<ClanData>('/account/clan');
  return response.data;
}

export async function queryClanPlayers(
  params: ClanPlayerQueryParams,
): Promise<PaginatedQueryResult<ClanPlayerQueryData>> {
  const searchParams = new URLSearchParams();
  searchParams.append('search', params.search);
  searchParams.append('sort', params.orderBy.field);
  searchParams.append('order', params.orderBy.order);
  searchParams.append('ipp', String(params.ipp));
  searchParams.append('page', String(params.page));

  const response = await get<PaginatedQueryResult<ClanPlayerQueryData>>(
    `/account/clan/players?${searchParams.toString()}`,
  );
  return response.data;
}

export async function createCredentials(
  data: CreateCredentialsPayload,
): Promise<CreateCredentialsData> {
  const response = await post<CreateCredentialsPayload, CreateCredentialsData>(
    '/account/credentials',
    data,
  );
  return response.data;
}

export async function deleteCredentials(clientId: string): Promise<void> {
  await _delete<{ clientId: string }>(`/account/credentials/${clientId}`);
}

export async function getCredentials(): Promise<CredentialsData[]> {
  const response = await get<CredentialsData[]>('/account/credentials');
  return response.data;
}

export async function getCurrentUser(): Promise<AccountData> {
  const response = await get<AccountData>('/account');
  return response.data;
}

export async function signInWithGoogle(token: string): Promise<void> {
  await post<{ token: string }>('/account/sign-in-with-google', { token });
}

export async function signOut(): Promise<void> {
  await post('/account/sign-out');
}

export async function verifyUsernameAvailability(
  username: string,
): Promise<boolean> {
  const response = await get<boolean>(
    `/account/verify-username-availability?username=${username}`,
  );
  return response.data;
}

export async function setUsername(username: string): Promise<void> {
  await post<SetUsernamePayload>('/account/set-username', { username });
}
