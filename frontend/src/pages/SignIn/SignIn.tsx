import { type CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { isApiError } from '$api';
import { signInWithGoogle } from '$api/account';
import AuthLayout from '$common/AuthLayout';
import Loading from '$common/Loading';
import { useTheme } from '$common/Theme';
import { usePageTitle } from '$hooks';
import { toast } from '$ui/hooks/use-toast';

function SignIn() {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  usePageTitle('Sign In');

  const signInMutation = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: signInWithGoogle,
    onError: (error) => {
      if (isApiError(error) && error.status === 403) {
        toast({
          title: 'Your account is disabled.',
          variant: 'destructive',
        });

        return;
      }

      toast({
        title: 'An unexpected error occurred while signing in.',
        description: 'Please try again later.',
        variant: 'destructive',
      });
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

export default SignIn;
