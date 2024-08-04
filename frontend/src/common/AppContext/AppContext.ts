import { createContext, useContext } from 'react';

import type { SessionData } from '$api/account';

export type AppContextType = SessionData;

export const AppContext = createContext<AppContextType>({
  user: null,
  clan: null,
});

function useAppContext() {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('useAppContext must be used within an AppContext.Provider');
  }

  return appContext;
}

export default useAppContext;
