import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import {
  Fragment,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import AppContext from '@/context';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createClan,
  createCredentials,
  CreateCredentialsData,
  getClan,
  ClanData,
  getCredentials,
  signOut,
  queryClanPlayers,
  ClanPlayerQueryParams,
  deleteCredentials,
  CredentialsData,
  updateCredentials,
} from '@/api/account';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import AppLayout from '@/components/layout/app-layout';
import usePageTitle from '@/hooks/usePageTitle';
import { Card, CardTitle } from '@/components/ui/card';
import Dashboard from '@/pages/Dashboard';

function parseScope(scope: string): { [key: string]: boolean } {
  const scopeArray = scope.split(',');

  return {
    'clan:reporting': scopeArray.includes('clan:reporting'),
    // TODO: add more scopes here
  };
}

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({ to: '/sign-in' });
    }

    if (!context.user.username) {
      throw redirect({ to: '/set-username' });
    }
  },
  component: Dashboard,
  // component: HomeComponent,
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

const CLAN_PLAYERS_IPP = 50;

function ClanInfo({ clan }: ClanInfoProps) {
  const { user } = useContext(AppContext);

  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<ClanPlayerQueryParams['orderBy']>({
    field: 'rank',
    order: 'DESC',
  });
  const [search, setSearch] = useState('');

  useEffect(
    () =>
      queryClanPlayersMutation.mutate({
        ipp: CLAN_PLAYERS_IPP,
        page,
        search,
        orderBy,
      }),
    [page, orderBy.field, orderBy.order, search],
  );

  useEffect(() => {
    setPage(1);
  }, [search, orderBy.field, orderBy.order]);

  if (!user || !clan) return null;

  const queryClanPlayersMutation = useMutation({
    mutationKey: ['query-clan-players'],
    mutationFn: queryClanPlayers,
  });

  const handleClickHeader = (
    newField: ClanPlayerQueryParams['orderBy']['field'],
  ) =>
    setOrderBy(({ field, order }) => ({
      field: newField,
      order: newField === field ? (order === 'ASC' ? 'DESC' : 'ASC') : 'ASC',
    }));

  const totalPages = Math.ceil(
    (queryClanPlayersMutation.data?.totalCount || 0) / CLAN_PLAYERS_IPP,
  );

  return (
    <div>
      <h2>{clan.name}</h2>
      <p>UUID: {clan.uuid}</p>
      <p>Admin: {clan.isAdmin ? 'Yes' : 'No'}</p>
      <h3>Clan members</h3>
      <p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username"
        />
      </p>
      {queryClanPlayersMutation.isPending ? (
        <p>Loading...</p>
      ) : (
        <Fragment>
          {queryClanPlayersMutation.data?.items.length ? (
            <Fragment>
              <p>
                Page:
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    style={{ margin: '0 0.25rem' }}
                    onClick={() => setPage(index + 1)}
                    disabled={index + 1 === page}
                  >
                    {index + 1}
                  </button>
                ))}
              </p>
              <table>
                <thead>
                  <tr>
                    <th
                      style={{
                        border: '1px solid gray',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      <span onClick={() => handleClickHeader('username')}>
                        Username
                        {orderBy.field === 'username' && (
                          <span style={{ marginLeft: '0.25rem' }}>
                            {orderBy.order === 'ASC' ? '↑' : '↓'}
                          </span>
                        )}
                      </span>
                    </th>
                    <th
                      style={{
                        border: '1px solid gray',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      <span onClick={() => handleClickHeader('rank')}>
                        Rank
                        {orderBy.field === 'rank' && (
                          <span style={{ marginLeft: '0.25rem' }}>
                            {orderBy.order === 'ASC' ? '↑' : '↓'}
                          </span>
                        )}
                      </span>
                    </th>
                    <th
                      style={{
                        border: '1px solid gray',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      <span onClick={() => handleClickHeader('lastSeenAt')}>
                        Last seen at
                        {orderBy.field === 'lastSeenAt' && (
                          <span style={{ marginLeft: '0.25rem' }}>
                            {orderBy.order === 'ASC' ? '↑' : '↓'}
                          </span>
                        )}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {queryClanPlayersMutation.data.items.map((player) => (
                    <tr key={player.uuid}>
                      <td style={{ border: '1px solid gray' }}>
                        {player.username}
                      </td>
                      <td style={{ border: '1px solid gray' }}>
                        {player.title && (
                          <img
                            style={{ marginRight: '0.25rem' }}
                            src={`/images/ranks/${player.title.replace(/\s+/g, '').toLowerCase()}.webp`}
                            alt={player.title}
                          />
                        )}
                        {player.title || player.rank}
                      </td>
                      <td style={{ border: '1px solid gray' }}>
                        {player.lastSeenAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Fragment>
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

  const [credentialsIdToUpdate, setCredentialsIdToUpdate] = useState<string>();

  const credentialsQuery = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials,
  });

  const credentialsToUpdate = useMemo(
    () =>
      credentialsQuery.data?.find(
        (credential) => credential.clientId === credentialsIdToUpdate,
      ),
    [credentialsQuery.data, credentialsIdToUpdate],
  );

  const deleteCredentialsMutation = useMutation({
    mutationKey: ['delete-credentials'],
    mutationFn: deleteCredentials,
    onSuccess: () => {
      credentialsQuery.refetch();
    },
  });

  const handleClickDeleteCredentials = (clientId: string) => {
    if (
      confirm(
        'Are you sure you want to delete these credentials? This action cannot be undone.',
      )
    ) {
      deleteCredentialsMutation.mutate(clientId);
    }
  };

  const handleCreateCredentialsSuccess = (data: CreateCredentialsData) => {
    setCreatedCredentials(data);
    credentialsQuery.refetch();
  };

  const handleUpdateCredentialsSuccess = () => {
    setCredentialsIdToUpdate(undefined);
    credentialsQuery.refetch();
  };

  return (
    <Fragment>
      <h2>Credentials</h2>
      {credentialsToUpdate && (
        <div
          style={{
            border: '1px solid blue',
            padding: '0 0.5rem 1rem',
            marginBottom: '1rem',
          }}
        >
          <UpdateCredentialsForm
            credentials={credentialsToUpdate}
            onSuccess={handleUpdateCredentialsSuccess}
          />
        </div>
      )}
      {createdCredentials && (
        <div
          style={{
            border: '1px solid green',
            padding: '0 0.5rem 1rem',
            marginBottom: '1 rem',
          }}
        >
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
                  <th style={{ border: '1px solid gray' }}>Actions</th>
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
                    <td style={{ border: '1px solid gray' }}>
                      <button
                        onClick={() =>
                          setCredentialsIdToUpdate(credential.clientId)
                        }
                      >
                        Edit
                      </button>{' '}
                      <button
                        onClick={() =>
                          handleClickDeleteCredentials(credential.clientId)
                        }
                      >
                        Delete
                      </button>
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
      <CreateCredentialsForm onSuccess={handleCreateCredentialsSuccess} />
    </Fragment>
  );
}

function SelectCredentialsScope() {
  // TODO: useId might not be needed anymore once we separate views
  const id = useId();

  return (
    <Fragment>
      <h4>Scope</h4>
      <p>
        These correspond to the permissions your credentials will have access
        to.
      </p>
      <p>
        <Field
          type="checkbox"
          id={`${id}-scope.clan:reporting`}
          name="scope.clan:reporting"
        />
        <label htmlFor={`${id}-scope.clan:reporting`}>Clan reporting</label>
      </p>
    </Fragment>
  );
}

type CreateCredentialsFormProps = {
  onSuccess: (data: CreateCredentialsData) => void;
};

function CreateCredentialsForm({ onSuccess }: CreateCredentialsFormProps) {
  const createCredentialsMutation = useMutation({
    mutationKey: ['create-credentials'],
    mutationFn: createCredentials,
    onSuccess,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      scope: {
        'clan:reporting': false,
      },
    },
    onSubmit: async ({ name, scope }) => {
      const scopeString = Object.keys(scope)
        .filter((key) => scope[key as keyof typeof scope])
        .join();

      createCredentialsMutation.mutate({ name, scope: scopeString });
    },
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
          <SelectCredentialsScope />
          <button type="submit">Create credentials</button>
        </Form>
      </FormikProvider>
    </Fragment>
  );
}

type UpdateCredentialsFormProps = {
  credentials: CredentialsData;
  onSuccess: () => void;
};

function UpdateCredentialsForm({
  credentials,
  onSuccess,
}: UpdateCredentialsFormProps) {
  const formik = useFormik({
    initialValues: {
      name: credentials.name,
      scope: parseScope(credentials.scope),
    },
    onSubmit: async ({ name, scope }) => {
      const scopeString = Object.keys(scope)
        .filter((key) => scope[key as keyof typeof scope])
        .join();

      updateCredentialsMutation.mutate({
        name,
        scope: scopeString,
        clientId: credentials.clientId,
      });
    },
  });

  const updateCredentialsMutation = useMutation({
    mutationKey: ['update-credentials'],
    mutationFn: updateCredentials,
    onSuccess,
  });

  return (
    <Fragment>
      <h3>Update '{credentials.name}'</h3>
      <FormikProvider value={formik}>
        <Form>
          <p>
            <Field name="name" placeholder="Name" />
          </p>
          <SelectCredentialsScope />
          <button type="submit">Update credentials</button>
        </Form>
      </FormikProvider>
    </Fragment>
  );
}

function HomeComponent() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  usePageTitle('Dashboard');

  const signOutMutation = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
  });

  if (!user) return null;

  return (
    <AppLayout>
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <Card className="b-none max-w-4xl bg-gradient-to-tr from-purple-400 to-blue-400 p-4 text-white">
        <CardTitle>Welcome, {user.username}! 👋</CardTitle>
      </Card>
      <div>
        <h1>Welcome, {user.username}!</h1>
        <p>
          <button onClick={() => signOutMutation.mutate()}>Sign out</button>
        </p>
        <Credentials />
        <Clan />
      </div>
    </AppLayout>
  );
}
