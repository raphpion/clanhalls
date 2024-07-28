import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import {
  setUsername,
  signOut,
  verifyUsernameAvailability,
} from '../api/account';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { ChangeEvent, useContext } from 'react';
import AuthLayout from '@/components/layout/auth-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppContext from '@/context';
import usePageTitle from '../hooks/usePageTitle';

export const Route = createFileRoute('/set-username')({
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({ to: '/sign-in' });
    }

    if (context.user.username) {
      throw redirect({ to: '/' });
    }
  },
  component: SetUsernameComponent,
});

function SetUsernameComponent() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  usePageTitle('Set Username');

  const formik = useFormik({
    initialValues: {
      username: '',
      usernameAvailable: false,
    },
    onSubmit: async ({ username, usernameAvailable }) => {
      if (!usernameAvailable) {
        return;
      }

      await setUsernameMutation.mutateAsync(username);
    },
  });

  const setUsernameMutation = useMutation({
    mutationKey: ['set-username'],
    mutationFn: setUsername,
    onSuccess: () => {
      navigate({ to: '/' });
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

  const handleUsernameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    formik.setValues({ username, usernameAvailable: false });

    if (!username) {
      return;
    }

    const result =
      await verifyUsernameAvailabilityMutation.mutateAsync(username);

    formik.setFieldValue('usernameAvailable', result);
  };

  if (!user) return null;

  return (
    <AuthLayout>
      <div className="max-w-md">
        <h1 className="mb-2 text-2xl font-bold">Welcome to Clan Halls!</h1>
        <p className="text-gray mb-4 text-sm">
          Currently signed in with Google account{' '}
          <a className="text-blue-500" href={`mailto:${user.email}`}>
            {user.email}
          </a>
          .
        </p>
        <p className="mb-8">
          Please set a username before you can access the application.
        </p>
        <FormikProvider value={formik}>
          <Form className="mb-8 flex w-full max-w-sm flex-row space-x-4">
            <Field
              name="username"
              placeholder="Username"
              onChange={handleUsernameChange}
              component={Input}
            />
            <Button
              color="blue"
              type="submit"
              disabled={!formik.values.usernameAvailable}
            >
              Set username
            </Button>
          </Form>
        </FormikProvider>
        <p>
          <button onClick={() => signOutMutation.mutate()}>Sign out</button>
        </p>
      </div>
    </AuthLayout>
  );
}
