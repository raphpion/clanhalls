import { createContext } from 'react';

import type { SessionData } from './api/account';

export type AppContext = {
  user: SessionData | null;
};

const AppContext = createContext<AppContext>({
  user: null,
});

export default AppContext;
