import { useMemo } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { CheckIcon, XIcon } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';

import { setUsername, signOut, verifyUsernameAvailability } from '$api/account';
import useAppContext from '$common/AppContext';
import Loading from '$common/Loading';
import OnboardingLayout from '$common/OnboardingLayout';
import { usePageTitle } from '$hooks';
import { Avatar, AvatarFallback, AvatarImage } from '$ui/avatar';
import { Button } from '$ui/button';
import { useToast } from '$ui/hooks/use-toast';
import { Input } from '$ui/input';
import { Label } from '$ui/label';

export type SetUsernameFormValues = {
  username: string;
};

function SetUsername() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { toast, genericErrorToast } = useToast();
  usePageTitle('Set Username');

  const setUsernameMutation = useMutation({
    mutationKey: ['set-username'],
    mutationFn: setUsername,
    onMutate: () => {
      toast({
        title: 'Setting username...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Username set!',
        variant: 'success',
      });
      navigate({ to: '/onboarding/create-clan' });
    },
    onError: genericErrorToast,
  });

  const signOutMutation = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
  });

  const formik = useFormik<SetUsernameFormValues>({
    initialValues: {
      username: '',
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .required('Please enter a username.')
        .min(3, 'Username must be at least 3 characters.')
        .max(25, 'Username must be at most 25 characters.'),
    }),
    onSubmit: async ({ username }) => setUsernameMutation.mutateAsync(username),
  });

  const [debouncedUsername] = useDebounce(formik.values.username, 500);
  const verifyUsernameAvailabilityQuery = useQuery({
    queryKey: ['verify-username-availability', debouncedUsername],
    queryFn: async () => {
      if (debouncedUsername.length < 3 || debouncedUsername.length > 25) {
        return { available: undefined };
      }

      return verifyUsernameAvailability(debouncedUsername);
    },
  });

  const usernameHelpLabel = useMemo(() => {
    if (formik.touched.username && formik.errors.username)
      return (
        <Label className="px-3 text-left text-red-500">
          <XIcon size={16} className="mr-1 inline" />
          {formik.errors.username}
        </Label>
      );

    if (verifyUsernameAvailabilityQuery.isFetching)
      return (
        <Label className="px-3 text-left text-yellow-500">
          <Loading size={16} className="mr-1 inline" />
          Verifying username availability...
        </Label>
      );

    if (verifyUsernameAvailabilityQuery.data?.available === false)
      return (
        <Label className="px-3 text-left text-red-500">
          <XIcon size={16} className="mr-1 inline" />
          Username not available!
        </Label>
      );

    if (verifyUsernameAvailabilityQuery.data?.available)
      return (
        <Label className="px-3 text-left text-green-500">
          <CheckIcon size={16} className="mr-1 inline" />
          Username available!
        </Label>
      );

    return <div className="h-[22px]" />;
  }, [
    formik.touched.username,
    formik.errors.username,
    verifyUsernameAvailabilityQuery.data?.available,
    verifyUsernameAvailabilityQuery.isFetching,
  ]);

  if (!user) return null;

  return (
    <OnboardingLayout title="Set username">
      <div className="mb-6 flex flex-col items-center justify-center">
        <Avatar className="mb-2 h-16 w-16">
          <AvatarImage src={user.pictureUrl || ''} alt={user.email} />
          <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="text-center">
          Signed in as {user.email}.<br />
          Not you?{' '}
          <Button
            variant="link"
            className="px-0 text-blue-500"
            onClick={() => signOutMutation.mutate()}
          >
            Sign out
          </Button>
        </p>
      </div>
      <div className="max-w-md">
        <p className="mb-8">
          Please set a username before you can access the application.
        </p>
        <FormikProvider value={formik}>
          <Form className="flex w-full max-w-sm flex-col space-y-2">
            <Field
              name="username"
              type="text"
              placeholder="Username"
              as={Input}
            />
            {usernameHelpLabel}
            <div className="flex flex-row justify-center space-x-4 pt-4">
              {setUsernameMutation.isPending ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  disabled={
                    !formik.isValid ||
                    !verifyUsernameAvailabilityQuery.data?.available ||
                    verifyUsernameAvailabilityQuery.isFetching
                  }
                >
                  Set username
                </Button>
              )}
            </div>
          </Form>
        </FormikProvider>
      </div>
    </OnboardingLayout>
  );
}

export default SetUsername;
