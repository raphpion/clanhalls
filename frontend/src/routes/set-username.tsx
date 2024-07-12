import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import {
  setUsername,
  signOut,
  verifyUsernameAvailability,
} from '../api/account';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { ChangeEvent } from 'react';

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
  const navigate = useNavigate();

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

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Please set a username before you can access the application.</p>
      <FormikProvider value={formik}>
        <Form>
          <Field
            name="username"
            placeholder="Username"
            onChange={handleUsernameChange}
          />
          <button type="submit" disabled={!formik.values.usernameAvailable}>
            Set username
          </button>
        </Form>
      </FormikProvider>
      <p>
        <button onClick={() => signOutMutation.mutate()}>Sign out</button>
      </p>
    </div>
  );
}

