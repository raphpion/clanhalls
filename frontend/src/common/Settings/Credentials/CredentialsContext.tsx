import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  type CreateCredentialsData,
  getCredentials,
  type CredentialsData,
  createCredentials,
  updateCredentials,
  type CreateCredentialsPayload,
  type UpdateCredentialsPayload,
  deleteCredentials,
} from '$api/account';

import CreateOrEditCredential, {
  type Props as CreateOrEditCrendentialProps,
} from './CreateOrEditCredential';

type CredentialsContextType = {
  loading: boolean;
  editPending: boolean;
  deletePending: boolean;
  createPending: boolean;
  credentials: CredentialsData[] | undefined;
  createdCredential: CreateCredentialsData | undefined;
  createOrEditSlideOutProps: CreateOrEditCrendentialProps;
  dismissCreatedCredential: () => void;
  openCreateSlideOut: () => void;
  openEditSlideOut: (credential: CredentialsData) => void;
  createCredentials: (
    payload: CreateCredentialsPayload,
  ) => Promise<CreateCredentialsData>;
  deleteCredentials: (clientId: string) => Promise<void>;
  editCredentials: (
    payload: UpdateCredentialsPayload & { clientId: string },
  ) => Promise<void>;
  refetch: () => Promise<unknown>;
};

const CredentialsContext = createContext<CredentialsContextType>({
  loading: false,
  editPending: false,
  createPending: false,
  deletePending: false,
  credentials: undefined,
  createdCredential: undefined,
  createOrEditSlideOutProps: {
    open: false,
    editingCredential: undefined,
    onOpenChange: () => {},
    onCreateSuccess: async () => {},
    onEditSuccess: async () => {},
  },
  dismissCreatedCredential: () => {},
  openCreateSlideOut: () => {},
  createCredentials: async () => ({
    name: '',
    scope: '',
    clientId: '',
    clientSecret: '',
    createdAt: '',
    lastUsedAt: null,
  }),
  deleteCredentials: async () => {},
  editCredentials: async () => {},
  openEditSlideOut: () => {},
  refetch: async () => {},
});

export function CredentialsContextProvider({ children }: PropsWithChildren) {
  const [createOrEditSlideOutOpen, setCreateOrEditSlideOutOpen] =
    useState(false);
  const [editingCredential, setEditingCredential] = useState<
    CredentialsData | undefined
  >(undefined);
  const [createdCredential, setCreatedCredential] =
    useState<CreateCredentialsData>();

  const credentialsQuery = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials,
  });

  const createCredentialsMutation = useMutation({
    mutationKey: ['create-credentials'],
    mutationFn: createCredentials,
  });

  const updateCredentialsMutation = useMutation({
    mutationKey: ['update-credentials'],
    mutationFn: updateCredentials,
  });

  const deleteCredentialMutation = useMutation({
    mutationKey: ['delete-credential'],
    mutationFn: deleteCredentials,
  });

  const handleCloseCreateOrEditSlideOut = useCallback((_: boolean) => {
    setCreateOrEditSlideOutOpen(false);
    setTimeout(() => setEditingCredential(undefined), 300);
  }, []);

  const handleOpenCreateSlideOut = useCallback(() => {
    setEditingCredential(undefined);
    setCreateOrEditSlideOutOpen(true);
  }, []);

  const handleOpenEditSlideOut = useCallback((credential: CredentialsData) => {
    setEditingCredential(credential);
    setCreateOrEditSlideOutOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(
    (createdCredential: CreateCredentialsData) => {
      credentialsQuery.data?.push({
        name: createdCredential.name,
        scope: createdCredential.scope,
        clientId: createdCredential.clientId,
        createdAt: createdCredential.createdAt,
        lastUsedAt: null,
      });

      setCreatedCredential(createdCredential);
      setCreateOrEditSlideOutOpen(false);
      setTimeout(() => setEditingCredential(undefined), 300);
      credentialsQuery.refetch();
    },
    [credentialsQuery],
  );

  const handleEditSuccess = useCallback(
    (name: string, scope: string) => {
      const updatedCredential = credentialsQuery.data?.find(
        (c) => c.clientId === editingCredential?.clientId,
      );

      if (updatedCredential) {
        updatedCredential.name = name;
        updatedCredential.scope = scope;
      }

      setCreateOrEditSlideOutOpen(false);
      setTimeout(() => setEditingCredential(undefined), 300);
      credentialsQuery.refetch();
    },
    [credentialsQuery, editingCredential?.clientId],
  );

  const value = useMemo(
    () => ({
      loading: credentialsQuery.isLoading,
      editPending: updateCredentialsMutation.isPending,
      createPending: createCredentialsMutation.isPending,
      deletePending: deleteCredentialMutation.isPending,
      credentials: credentialsQuery.data,
      createdCredential,
      createOrEditSlideOutProps: {
        open: createOrEditSlideOutOpen,
        editingCredential,
        onOpenChange: handleCloseCreateOrEditSlideOut,
        onCreateSuccess: handleCreateSuccess,
        onEditSuccess: handleEditSuccess,
      },
      dismissCreatedCredential: () => setCreatedCredential(undefined),
      openCreateSlideOut: handleOpenCreateSlideOut,
      openEditSlideOut: handleOpenEditSlideOut,
      createCredentials: createCredentialsMutation.mutateAsync,
      deleteCredentials: deleteCredentialMutation.mutateAsync,
      editCredentials: updateCredentialsMutation.mutateAsync,
      refetch: credentialsQuery.refetch,
    }),
    [
      createCredentialsMutation.isPending,
      createCredentialsMutation.mutateAsync,
      createOrEditSlideOutOpen,
      createdCredential,
      credentialsQuery.data,
      credentialsQuery.isLoading,
      credentialsQuery.refetch,
      deleteCredentialMutation.isPending,
      deleteCredentialMutation.mutateAsync,
      editingCredential,
      handleCloseCreateOrEditSlideOut,
      handleCreateSuccess,
      handleEditSuccess,
      handleOpenCreateSlideOut,
      handleOpenEditSlideOut,
      updateCredentialsMutation.isPending,
      updateCredentialsMutation.mutateAsync,
    ],
  );

  return (
    <CredentialsContext.Provider value={value}>
      {children}
      <CreateOrEditCredential {...value.createOrEditSlideOutProps} />
    </CredentialsContext.Provider>
  );
}

function useCredentialsContext() {
  const context = useContext(CredentialsContext);

  if (context === undefined) {
    throw new Error(
      'useCredentials must be used within a CredentialsContextProvider',
    );
  }

  return context;
}

export default useCredentialsContext;
