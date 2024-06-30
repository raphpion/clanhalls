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
    </div>
  );
}

export default App;

