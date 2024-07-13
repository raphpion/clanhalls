import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { Fragment, useContext, useState } from 'react';
import AppContext from '../context';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createClan,
  createCredentials,
  CreateCredentialsData,
  getClan,
  ClanData,
  getCredentials,
  signOut,
  getClanPlayers,
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

function Clan() {
  const clanQuery = useQuery({
    queryKey: ['clan'],
    queryFn: getClan,
  });

  if (clanQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (!clanQuery.data) {
    return <CreateClanForm />;
  }

  return <ClanInfo clan={clanQuery.data} />;
}

type ClanInfoProps = {
  clan: ClanData;
};

function ClanInfo({ clan }: ClanInfoProps) {
  const { user } = useContext(AppContext);

  if (!user || !clan) return null;

  const clanPlayersQuery = useQuery({
    queryKey: ['clan-players'],
    queryFn: getClanPlayers,
  });

  return (
    <div>
      <h2>{clan.name}</h2>
      <p>UUID: {clan.uuid}</p>
      <p>Admin: {clan.isAdmin ? 'Yes' : 'No'}</p>
      <h3>Clan members</h3>
      {clanPlayersQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <Fragment>
          {clanPlayersQuery.data?.length ? (
            <table>
              <thead>
                <tr>
                  <th style={{ border: '1px solid gray' }}>Username</th>
                  <th style={{ border: '1px solid gray' }}>Rank</th>
                  <th style={{ border: '1px solid gray' }}>Last seen at</th>
                </tr>
              </thead>
              <tbody>
                {clanPlayersQuery.data.map((player) => (
                  <tr key={player.uuid}>
                    <td style={{ border: '1px solid gray' }}>
                      {player.username}
                    </td>
                    <td style={{ border: '1px solid gray' }}>{player.rank}</td>
                    <td style={{ border: '1px solid gray' }}>
                      {player.lastSeenAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              There are currently no players. Use the RuneLite plugin to
              generate data!
            </p>
          )}
        </Fragment>
      )}
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

function Credentials() {
  const [createdCredentials, setCreatedCredentials] =
    useState<CreateCredentialsData>();

  const credentialsQuery = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials,
  });

  return (
    <Fragment>
      <h2>Credentials</h2>
      {createdCredentials && (
        <div style={{ border: '1px solid green', padding: '0 0.5rem 1rem' }}>
          <h4>Credentials created successfully!</h4>
          <table>
            <thead>
              <tr>
                <th style={{ border: '1px solid gray' }}>Client ID</th>
                <th style={{ border: '1px solid gray' }}>Client secret</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid gray' }}>
                  {createdCredentials.clientId}
                </td>
                <td style={{ border: '1px solid gray' }}>
                  {createdCredentials.clientSecret}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {credentialsQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <Fragment>
          {credentialsQuery.data?.length ? (
            <table>
              <thead>
                <tr>
                  <th style={{ border: '1px solid gray' }}>Name</th>
                  <th style={{ border: '1px solid gray' }}>Scope</th>
                  <th style={{ border: '1px solid gray' }}>Client ID</th>
                  <th style={{ border: '1px solid gray' }}>Created at</th>
                  <th style={{ border: '1px solid gray' }}>Last used at</th>
                </tr>
              </thead>
              <tbody>
                {credentialsQuery.data.map((credential) => (
                  <tr key={credential.clientId}>
                    <td style={{ border: '1px solid gray' }}>
                      {credential.name}
                    </td>
                    <td style={{ border: '1px solid gray' }}>
                      {credential.scope.replace(',', ', ')}
                    </td>
                    <td style={{ border: '1px solid gray' }}>
                      {credential.clientId}
                    </td>
                    <td style={{ border: '1px solid gray' }}>
                      {credential.createdAt}
                    </td>
                    <td style={{ border: '1px solid gray' }}>
                      {credential.lastUsedAt || 'never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>You don't have any credentials.</p>
          )}
        </Fragment>
      )}
      <CreateCredentialsForm onSuccess={setCreatedCredentials} />
    </Fragment>
  );
}

type CreateCredentialsFormProps = {
  onSuccess: (data: CreateCredentialsData) => void;
};

function CreateCredentialsForm({ onSuccess }: CreateCredentialsFormProps) {
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
    onSuccess,
  });

  return (
    <Fragment>
      <h3>Create credentials</h3>
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
      <Credentials />
      <Clan />
      <p>
        <button onClick={() => signOutMutation.mutate()}>Sign out</button>
      </p>
    </div>
  );
}

