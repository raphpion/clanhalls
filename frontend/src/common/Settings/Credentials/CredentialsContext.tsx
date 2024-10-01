import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useQuery } from '@tanstack/react-query';

import { getCredentials, type CredentialsData } from '$api/account';

import CreateOrEditCredential from './CreateOrEditCredential';

type CredentialsContextType = {
  loading: boolean;
  credentials: CredentialsData[] | undefined;
  createOrEditSlideOutProps: {
    open: boolean;
    editingCredential: CredentialsData | undefined;
    onOpenChange: (open: boolean) => void;
  };
  openCreationSlideOut: () => void;
  openEditSlideOut: (credential: CredentialsData) => void;
};

const CredentialsContext = createContext<CredentialsContextType>({
  loading: false,
  credentials: undefined,
  createOrEditSlideOutProps: {
    open: false,
    editingCredential: undefined,
    onOpenChange: () => {},
  },
  openCreationSlideOut: () => {},
  openEditSlideOut: () => {},
});

export function CredentialsContextProvider({ children }: PropsWithChildren) {
  const [createOrEditSlideOutOpen, setCreateOrEditSlideOutOpen] =
    useState(false);
  const [editingCredential, setEditingCredential] = useState<
    CredentialsData | undefined
  >(undefined);

  const credentialsQuery = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials,
  });

  const handleCloseCreateOrEditSlideOut = useCallback((_: boolean) => {
    setCreateOrEditSlideOutOpen(false);
    setEditingCredential(undefined);
  }, []);

  const value = useMemo(
    () => ({
      loading: credentialsQuery.isLoading,
      credentials: credentialsQuery.data,
      createOrEditSlideOutProps: {
        open: createOrEditSlideOutOpen,
        editingCredential,
        onOpenChange: handleCloseCreateOrEditSlideOut,
      },
      openCreationSlideOut: () => setCreateOrEditSlideOutOpen(true),
      openEditSlideOut: (credential: CredentialsData) => {
        setEditingCredential(credential);
        setCreateOrEditSlideOutOpen(true);
      },
    }),
    [
      createOrEditSlideOutOpen,
      credentialsQuery.data,
      credentialsQuery.isLoading,
      editingCredential,
      handleCloseCreateOrEditSlideOut,
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
