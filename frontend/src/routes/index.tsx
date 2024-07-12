import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { useContext } from 'react';
import AppContext from '../context';
import { useMutation } from '@tanstack/react-query';
import { createClan, signOut } from '../api/account';
import { Field, Form, FormikProvider, useFormik } from 'formik';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({ to: '/sign-in' });
    }

    if (!context.user.username) {
      throw redirect({ to: '/set-username' });
    }
  },
  component: HomeComponent,
});

function ClanInfo() {
  const { user } = useContext(AppContext);

  if (!user || !user.clan) return null;

  return (
    <div>
      <h2>{user.clan.name}</h2>
      <p>Admin: {user.clan?.isAdmin ? 'Yes' : 'No'}</p>
    </div>
  );
}

function CreateClanForm() {
  const router = useRouter();

  const createClanMutation = useMutation({
    mutationKey: ['create-clan'],
    mutationFn: createClan,
  });

  const formik = useFormik({
    initialValues: { name: '' },
    onSubmit: async ({ name }) => {
      await createClanMutation.mutateAsync(name);
      router.navigate({ to: '/' });
    },
  });

  return (
    <div>
      <p>You are currently not a member of a clan.</p>
      <h2>Create a clan</h2>
      <FormikProvider value={formik}>
        <Form>
          <Field name="name" placeholder="Clan name" />
          <button type="submit">Create clan</button>
        </Form>
      </FormikProvider>
    </div>
  );
}

function HomeComponent() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const signOutMutation = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
  });

  if (!user) return null;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      {user.clan ? <ClanInfo /> : <CreateClanForm />}
      <p>
        <button onClick={() => signOutMutation.mutate()}>Sign out</button>
      </p>
    </div>
  );
}

