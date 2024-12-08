import {
  _delete,
  get,
  post,
  put,
  type PaginatedQueryParams,
  type PaginatedQueryResult,
} from '.';

export type SessionData = {
  user: {
    googleId: string;
    username: string | null;
    email: string;
    emailNormalized: string;
    emailVerified: boolean;
    pictureUrl: string | null;
    isClanAdmin: boolean;
    isSuperAdmin: boolean;
  } | null;

  clan: {
    uuid: string;
    name: string;
    nameInGame: string | null;
    lastSyncedAt: string | null;
  } | null;
};

export type ClanPlayerQueryData = {
  uuid: string;
  username: string;
  rank: number;
  title: string | undefined;
  lastSeenAt: string;
};

export type ClanPlayerQueryParams = PaginatedQueryParams<{
  search: string;
  orderBy: {
    field: 'username' | 'rank' | 'lastSeenAt';
    order: 'ASC' | 'DESC';
  };
  inactiveFor?: '1week' | '1month' | '3months' | '6months' | '1year';
}>;

export type CreateClanPayload = {
  name: string;
};

export type CreateCredentialsPayload = {
  name: string;
  scope: string;
};

export type UpdateCredentialsPayload = {
  name: string;
  scope: string;
};

export type CreateCredentialsData = {
  name: string;
  scope: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
  lastUsedAt: string | null;
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
  nameInGame: string | null;
  lastSyncedAt: string | null;
  isAdmin: boolean;
} | null;

export type ActiveSessionData = {
  uuid: string;
  method: string;
  ipAddress: string;
  deviceType: string;
  os: string;
  browser: string;
  location: string;
  lastSeenAt: string;
  isCurrent: boolean;
};

export type SetUsernamePayload = {
  username: string;
};

export type VerifyUsernameAvailabilityData = {
  available: boolean;
};

export type VerifyClanNameAvailabilityData = {
  available: boolean;
};

export async function createClan(name: string): Promise<void> {
  await post<CreateClanPayload>('/api/account/clan', { name });
}

export async function deleteMyClan(): Promise<void> {
  await _delete('/api/account/clan');
}

export async function getClan(): Promise<ClanData> {
  const response = await get<ClanData>('/api/account/clan');
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
  if (params.inactiveFor) {
    searchParams.append('inactiveFor', params.inactiveFor);
  }

  const response = await get<PaginatedQueryResult<ClanPlayerQueryData>>(
    `/api/account/clan/players?${searchParams.toString()}`,
  );
  return response.data;
}

export async function createCredentials(
  payload: CreateCredentialsPayload,
): Promise<CreateCredentialsData> {
  const response = await post<CreateCredentialsPayload, CreateCredentialsData>(
    '/api/account/credentials',
    payload,
  );
  return response.data;
}

export async function deleteCredentials(clientId: string): Promise<void> {
  await _delete<{ clientId: string }>(`/api/account/credentials/${clientId}`);
}

export async function getCredentials(): Promise<CredentialsData[]> {
  const response = await get<CredentialsData[]>('/api/account/credentials');
  return response.data;
}

export async function getSession(): Promise<SessionData> {
  const response = await get<SessionData>('/api/account');
  return response.data;
}

export async function getActiveSessions(): Promise<ActiveSessionData[]> {
  const response = await get<ActiveSessionData[]>('/api/account/sessions');
  return response.data;
}

export async function revokeSession(uuid: string): Promise<void> {
  await _delete(`/api/account/sessions/${uuid}`);
}

export async function revokeAllSessions(): Promise<void> {
  await _delete('/api/account/sessions');
}

export async function signInWithGoogle(token: string): Promise<void> {
  await post<{ token: string }>('/api/account/sign-in-with-google', { token });
}

export async function signOut(): Promise<void> {
  await post('/api/account/sign-out');
}

export async function updateCredentials(
  payload: UpdateCredentialsPayload & { clientId: string },
): Promise<void> {
  const { clientId, ...payloadWithoutClientId } = payload;

  await put<UpdateCredentialsPayload>(
    `/api/account/credentials/${clientId}`,
    payloadWithoutClientId,
  );
}

export async function verifyClanNameAvailability(
  name: string,
): Promise<VerifyClanNameAvailabilityData> {
  const response = await get<VerifyClanNameAvailabilityData>(
    `/api/account/clan/verify-name-availability?name=${name}`,
  );
  return response.data;
}

export async function verifyUsernameAvailability(
  username: string,
): Promise<VerifyUsernameAvailabilityData> {
  const response = await get<VerifyUsernameAvailabilityData>(
    `/api/account/verify-username-availability?username=${username}`,
  );
  return response.data;
}

export async function setUsername(username: string): Promise<void> {
  await post<SetUsernamePayload>('/api/account/set-username', { username });
}
