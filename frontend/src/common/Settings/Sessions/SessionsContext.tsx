import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getActiveSessions,
  revokeSession,
  type ActiveSessionData,
} from '$api/account';

type SessionsContextType = {
  loading: boolean;
  sessions: ActiveSessionData[] | undefined;
  revokeSession: (uuid: string) => Promise<void>;
  refetch: () => Promise<unknown>;
};

const SessionsContext = createContext<SessionsContextType>({
  loading: false,
  sessions: undefined,
  revokeSession: async () => {},
  refetch: async () => {},
});

export function SessionsContextProvider({ children }: PropsWithChildren) {
  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: getActiveSessions,
  });

  const revokeSessionMutation = useMutation({
    mutationKey: ['revokeSession'],
    mutationFn: revokeSession,
  });

  const value = useMemo(
    () => ({
      loading: sessionsQuery.isLoading,
      sessions: sessionsQuery.data,
      revokeSession: revokeSessionMutation.mutateAsync,
      refetch: sessionsQuery.refetch,
    }),
    [
      sessionsQuery.isLoading,
      sessionsQuery.data,
      sessionsQuery.refetch,
      revokeSessionMutation.mutateAsync,
    ],
  );

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}

function useSessionsContext() {
  const context = useContext(SessionsContext);

  if (context === undefined) {
    throw new Error(
      'useSessionsContext must be used within a SessionsContextProvider',
    );
  }

  return context;
}

export default useSessionsContext;
