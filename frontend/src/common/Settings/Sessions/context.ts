import { createContext, useContext } from 'react';

import { type ActiveSessionData } from '$api/account';

export type SessionsContextType = {
  loading: boolean;
  sessions: ActiveSessionData[] | undefined;
  revokeAllSessions: () => Promise<void>;
  revokeSession: (uuid: string) => Promise<void>;
  refetch: () => Promise<unknown>;
};

export const SessionsContext = createContext<SessionsContextType>({
  loading: false,
  sessions: undefined,
  revokeAllSessions: async () => {},
  revokeSession: async () => {},
  refetch: async () => {},
});

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
