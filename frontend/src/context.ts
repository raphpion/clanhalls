import { createContext } from 'react';

import type { AccountData } from './api/account';

export type AppContext = {
  user: AccountData | null;
};

const AppContext = createContext<AppContext>({
  user: null,
});

export default AppContext;
