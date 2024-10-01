import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  type CreateCredentialsData,
  getCredentials,
  type CredentialsData,
} from '$api/account';

import CreateOrEditCredential, {
  type Props as CreateOrEditCrendentialProps,
} from './CreateOrEditCredential';

type CredentialsContextType = {
  loading: boolean;
  credentials: CredentialsData[] | undefined;
  createdCredential: CreateCredentialsData | undefined;
  createOrEditSlideOutProps: CreateOrEditCrendentialProps;
  dismissCreatedCredential: () => void;
  openCreateSlideOut: () => void;
  openEditSlideOut: (credential: CredentialsData) => void;
  refetch: () => Promise<unknown>;
};

const CredentialsContext = createContext<CredentialsContextType>({
  loading: false,
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
      // TODO: optimistic update
      setCreatedCredential(createdCredential);
      setCreateOrEditSlideOutOpen(false);
      setTimeout(() => setEditingCredential(undefined), 300);
      credentialsQuery.refetch();
    },
    [credentialsQuery],
  );

  const handleEditSuccess = useCallback(
    (_: string, __: string) => {
      // TODO: optimistic update
      setCreateOrEditSlideOutOpen(false);
      setTimeout(() => setEditingCredential(undefined), 300);
      credentialsQuery.refetch();
    },
    [credentialsQuery],
  );

  const value = useMemo(
    () => ({
      loading: credentialsQuery.isLoading,
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
      refetch: credentialsQuery.refetch,
    }),
    [
      createOrEditSlideOutOpen,
      createdCredential,
      credentialsQuery.data,
      credentialsQuery.isLoading,
      credentialsQuery.refetch,
      editingCredential,
      handleCloseCreateOrEditSlideOut,
      handleCreateSuccess,
      handleEditSuccess,
      handleOpenCreateSlideOut,
      handleOpenEditSlideOut,
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
