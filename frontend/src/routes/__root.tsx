import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import AppContext from '../context';
import { AccountData, getCurrentUser } from '../api/account';

type Context = {
  user: AccountData | null;
};

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
  beforeLoad: async () => {
    const user = await getCurrentUser();
    return { user };
  },
  loader: async ({ context }) => {
    const { user } = context;
    return { user };
  },
});

function RootComponent() {
  const data = Route.useLoaderData();

  return (
    <AppContext.Provider value={data}>
      <Outlet />
    </AppContext.Provider>
  );
}

