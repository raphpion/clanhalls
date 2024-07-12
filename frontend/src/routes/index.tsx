import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { Fragment, useContext, useState } from 'react';
import AppContext from '../context';
import { useMutation } from '@tanstack/react-query';
import {
  createClan,
  createCredentials,
  CreateCredentialsData,
  signOut,
} from '../api/account';
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

function Credentials() {}

function CreateCredentialsForm() {
  const [createdCredentials, setCreatedCredentials] =
    useState<CreateCredentialsData>();

  const formik = useFormik({
    initialValues: {
      name: '',
      scope: {
        'clan:reporting': false,
      },
    },
    onSubmit: async ({ name, scope }) => {
      console.log(scope);
      const scopeString = Object.keys(scope)
        .filter((key) => scope[key as keyof typeof scope])
        .join();

      createCredentialsMutation.mutate({ name, scope: scopeString });
    },
  });

  const createCredentialsMutation = useMutation({
    mutationKey: ['create-credentials'],
    mutationFn: createCredentials,
    onSuccess: setCreatedCredentials,
  });

  return (
    <Fragment>
      <h3>Create credentials</h3>
      {createdCredentials && (
        <div style={{ border: '1px solid green', padding: '0 0.5rem 1rem' }}>
          <h4>Credentials created successfully!</h4>
          <table>
            <thead>
              <tr>
                <th style={{ border: '1px solid black' }}>Client ID</th>
                <th style={{ border: '1px solid black' }}>Client secret</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black' }}>
                  {createdCredentials.clientId}
                </td>
                <td style={{ border: '1px solid black' }}>
                  {createdCredentials.clientSecret}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <p>
        Create a set of credentials to access the API via webhooks. You will
        only be able to see your client secret once!
      </p>
      <FormikProvider value={formik}>
        <Form>
          <p>
            <Field name="name" placeholder="Name" />
          </p>
          <h4>Scope</h4>
          <p>
            These correspond to the permissions your credentials will have
            access to.
          </p>
          <p>
            <Field
              type="checkbox"
              id="scope.clan:reporting"
              name="scope.clan:reporting"
            />
            <label htmlFor="scope.clan:reporting">Clan reporting</label>
          </p>
          <button type="submit">Create credentials</button>
        </Form>
      </FormikProvider>
    </Fragment>
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
      <CreateCredentialsForm />
      {user.clan ? <ClanInfo /> : <CreateClanForm />}
      <p>
        <button onClick={() => signOutMutation.mutate()}>Sign out</button>
      </p>
    </div>
  );
}

