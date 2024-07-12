import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { signInWithGoogle } from '../api/account';
import { useMutation } from '@tanstack/react-query';

export const Route = createFileRoute('/sign-in')({
  beforeLoad: ({ context, location }) => {
    if (context.user === null) {
      return;
    }

    if (!context.user.username) {
      throw redirect({
        to: '/set-username',
        search: { next: location.pathname },
      });
    }

    throw redirect({ to: '/' });
  },
  component: SignInComponent,
});

function SignInComponent() {
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: signInWithGoogle,
    onError: () => {
      // TODO: handle error
    },
    onSuccess: () => navigate({ to: '/' }),
  });

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const { credential } = response;
    if (!credential) {
      return;
    }

    signInMutation.mutate(credential);
  };

  return (
    <div>
      <h1>Sign in</h1>
      <p>Welcome! Please sign in to continue.</p>
      <GoogleLogin onSuccess={handleGoogleSuccess} />
    </div>
  );
}

