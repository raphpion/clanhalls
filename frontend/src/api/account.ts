import { get, post } from '.';

export type AccountData = {
  googleId: string;
  username?: string;
  email: string;
  emailNormalized: string;
  emailVerified: boolean;
} | null;

export type SetUsernamePayload = {
  username: string;
};

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
