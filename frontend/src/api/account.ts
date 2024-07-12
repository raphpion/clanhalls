import { get, post } from '.';

export type AccountData = {
  googleId: string;
  username?: string;
  email: string;
  emailNormalized: string;
  emailVerified: boolean;
  clan: {
    uuid: string;
    name: string;
    isAdmin: boolean;
  } | null;
} | null;

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

export type SetUsernamePayload = {
  username: string;
};

export async function createClan(name: string): Promise<void> {
  await post<CreateClanPayload>('/account/create-clan', { name });
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
