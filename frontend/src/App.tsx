import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { _delete, get, post } from './api';
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import { ChangeEvent, useRef, useState } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const queryClient = new QueryClient();

type AccountData = {
  googleId: string;
  username?: string;
  email: string;
  emailNormalized: string;
  emailVerified: boolean;
} | null;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthTest />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

function AuthTest() {
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const authQuery = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const { data } = await get<AccountData>('http://localhost:5000/account');
      return data;
    },
  });

  const signInMutation = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: async (token: string) => {
      await post<{ token: string }>(
        'http://localhost:5000/account/sign-in-with-google',
        {
          token,
        },
      );
    },
    onSuccess: () => {
      authQuery.refetch();
    },
  });

  const signOutMutation = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: async () => {
      await post('http://localhost:5000/account/sign-out');
    },
    onSuccess: () => {
      authQuery.refetch();
    },
  });

  const verifyUsernameAvailabilityMutation = useMutation({
    mutationKey: ['verify-username-availability'],
    mutationFn: async (username: string) => {
      const { data } = await get<{ available: boolean }>(
        `http://localhost:5000/account/verify-username-availability?username=${username}`,
      );

      setUsernameAvailable(data.available);
    },
  });

  const setUsernameMutation = useMutation({
    mutationKey: ['set-username'],
    mutationFn: async (username: string) => {
      await post<{ username: string }>(
        'http://localhost:5000/account/set-username',
        {
          username,
        },
      );
    },
    onSuccess: () => {
      authQuery.refetch();
    },
  });

  const handleGoogleError = () => {
    console.error('Error while signing in with Google!');
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const { credential } = response;
    if (!credential) {
      return;
    }

    await signInMutation.mutateAsync(credential);
  };

  const handleUsernameFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = usernameInputRef.current?.value;
    if (!username) {
      return;
    }

    await setUsernameMutation.mutateAsync(username);
  };

  const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameAvailable(false);

    const value = e.target.value;
    if (!value) {
      return;
    }

    verifyUsernameAvailabilityMutation.mutateAsync(value);
  };

  if (authQuery.isError) {
    return <div>Error while fetching!</div>;
  }

  if (authQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authQuery.data) {
    return (
      <div>
        <p>Not authenticated</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>
    );
  }

  if (!authQuery.data.username) {
    return (
      <div>
        <p>We need to set your username!</p>
        <form onSubmit={handleUsernameFormSubmit}>
          <input
            ref={usernameInputRef}
            type="text"
            placeholder="Username"
            onChange={handleUsernameInputChange}
          />
          {!verifyUsernameAvailabilityMutation.isPending &&
            usernameAvailable && (
              <p>
                <em>{usernameInputRef.current?.value}</em> is available!{' '}
                <button type="submit">Set username</button>
              </p>
            )}
        </form>
        <button onClick={() => signOutMutation.mutateAsync()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {authQuery.data.username}!</h1>
      <p>GoogleId: {authQuery.data.googleId}</p>
      <p>Email: {authQuery.data.email}</p>
      <p>Email verified: {authQuery.data.emailVerified ? 'Yes' : 'No'}</p>
      <button onClick={() => signOutMutation.mutateAsync()}>Sign out</button>
    </div>
  );
}

export default App;
