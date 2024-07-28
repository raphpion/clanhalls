import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { signInWithGoogle } from '../api/account';
import { useMutation } from '@tanstack/react-query';
import AuthLayout from '@/components/layout/auth-layout';
import Loading from '../components/loading';
import { useTheme } from '../components/theme-provider';
import usePageTitle from '../hooks/usePageTitle';

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
  const { actualTheme } = useTheme();
  usePageTitle('Sign In');

  const signInMutation = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: signInWithGoogle,
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
    <AuthLayout>
      <h1 className="mb-2 text-2xl font-bold">Sign in to your account</h1>
      <p className="mb-8">
        If you don't have an account, it will be automatically created.
      </p>
      {signInMutation.isPending ? (
        <Loading />
      ) : (
        <GoogleLogin
          theme={actualTheme === 'dark' ? 'filled_blue' : 'outline'}
          locale="en"
          onSuccess={handleGoogleSuccess}
        />
      )}
    </AuthLayout>
  );
}
