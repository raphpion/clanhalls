import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useMemo } from 'react';
import * as yup from 'yup';

import { setUsername, signOut, verifyUsernameAvailability } from '$api/account';
import { Loading, OnboardingLayout, useAppContext } from '$common';
import { Input } from '$ui/input';
import { Button } from '$ui/button';
import { usePageTitle } from '$hooks';
import { Label } from '$ui/label';
import { CheckIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '$ui/avatar';

export type SetUsernameFormValues = {
  username: string;
  usernameAvailable: boolean | undefined;
};

function SetUsername() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  usePageTitle('Set Username');

  const formik = useFormik<SetUsernameFormValues>({
    initialValues: {
      username: '',
      usernameAvailable: undefined,
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .required('Please enter a username.')
        .min(3, 'Username must be at least 3 characters.')
        .max(25, 'Username must be at most 25 characters.'),
      usernameAvailable: yup.boolean().required().nullable(),
    }),
    onSubmit: async ({ username }) => setUsernameMutation.mutateAsync(username),
  });

  const setUsernameMutation = useMutation({
    mutationKey: ['set-username'],
    mutationFn: setUsername,
    onSuccess: () => {
      navigate({ to: '/onboarding/create-or-join-clan' });
    },
  });

  const signOutMutation = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
  });

  const verifyUsernameAvailabilityMutation = useMutation({
    mutationKey: ['verify-username-availability'],
    mutationFn: (username: string) => verifyUsernameAvailability(username),
  });

  useEffect(() => {
    (async () => {
      formik.setFieldValue('usernameAvailable', null);
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        return;
      }

      const data = await verifyUsernameAvailabilityMutation.mutateAsync(
        formik.values.username,
      );
      formik.setFieldValue('usernameAvailable', data.available);
    })();
  }, [formik.values.username]);

  if (!user) return null;

  const usernameHelpLabel = useMemo(() => {
    if (formik.touched.username && formik.errors.username)
      return (
        <Label className="px-3 text-left text-red-500">
          <XIcon size={16} className="mr-1 inline" />
          {formik.errors.username}
        </Label>
      );

    if (formik.values.usernameAvailable === false)
      return (
        <Label className="px-3 text-left text-red-500">
          <XIcon size={16} className="mr-1 inline" />
          Username not available!
        </Label>
      );

    if (verifyUsernameAvailabilityMutation.isPending)
      return (
        <Label className="px-3 text-left text-yellow-500">
          <Loading size={16} className="mr-1 inline" />
          Verifying username availability...
        </Label>
      );

    if (formik.values.usernameAvailable)
      return (
        <Label className="px-3 text-left text-green-500">
          <CheckIcon size={16} className="mr-1 inline" />
          Username available!
        </Label>
      );

    return <div className="h-[22px]" />;
  }, [
    formik.touched.username,
    formik.values.usernameAvailable,
    formik.errors.username,
    verifyUsernameAvailabilityMutation.isPending,
  ]);

  return (
    <OnboardingLayout title="Set username">
      <div className="mb-6 flex flex-col items-center justify-center">
        <Avatar className="mb-2 h-16 w-16">
          <AvatarImage src={user.pictureUrl || ''} alt={user.username} />
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
          <Form className="mb-8 flex w-full max-w-sm flex-col space-y-2">
            <Field
              name="username"
              type="text"
              placeholder="Username"
              as={Input}
            />
            {usernameHelpLabel}
            <div className="flex flex-row justify-center space-x-4 pt-4">
              <Button type="submit" disabled={!formik.isValid}>
                Set username
              </Button>
              <Button
                variant="outline"
                onClick={() => signOutMutation.mutate()}
              >
                Sign out
              </Button>
            </div>
          </Form>
        </FormikProvider>
        <p></p>
      </div>
    </OnboardingLayout>
  );
}

export default SetUsername;
