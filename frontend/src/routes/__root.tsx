import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import { AppContext } from '$common/AppContext';
import { ConfirmationDialogProvider } from '$common/ConfirmationDialog/ConfirmationDialogContext';
import { ThemeProvider } from '$common/Theme';

import { type SessionData, getSession } from '../api/account';

type Context = SessionData;

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
  beforeLoad: async () => {
    const data = await getSession();
    return data;
  },
  loader: async ({ context }) => {
    const { user, clan } = context;
    return { user, clan };
  },
});

function RootComponent() {
  const data = Route.useLoaderData();

  return (
    <AppContext.Provider value={data}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ConfirmationDialogProvider>
          <Outlet />
        </ConfirmationDialogProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
