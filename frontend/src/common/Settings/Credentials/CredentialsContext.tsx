import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { useQuery } from '@tanstack/react-query';

import { getCredentials, type CredentialsData } from '$api/account';

type CredentialsContextType = {
  loading: boolean;
  credentials: CredentialsData[] | undefined;
};

const CredentialsContext = createContext<CredentialsContextType>({
  loading: false,
  credentials: undefined,
});

export function CredentialsContextProvider({ children }: PropsWithChildren) {
  const credentialsQuery = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials,
  });

  const value = useMemo(
    () => ({
      loading: credentialsQuery.isLoading,
      credentials: credentialsQuery.data,
    }),
    [credentialsQuery.data, credentialsQuery.isLoading],
  );

  return (
    <CredentialsContext.Provider value={value}>
      {children}
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
