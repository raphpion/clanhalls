import useAppContext from '$common/AppContext';
import AppLayout from '$common/AppLayout';
import { usePageTitle } from '$hooks';
import { Card, CardContent, CardHeader, CardTitle } from '$ui/card';

import ClanInformation from './widgets/ClanInformation';
import ClanPlayers from './widgets/ClanPlayers';

function Dashboard() {
  const { user } = useAppContext();
  usePageTitle('Dashboard');

  if (!user) return null;

  return (
    <AppLayout>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <Card className="b-none mb-8 max-w-4xl bg-gradient-to-tr from-purple-400 to-blue-400 text-white">
        <CardHeader>
          <CardTitle>Welcome, {user.username}! 👋</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <a
                className="underline"
                target="_blank"
                href="https://discord.gg/eU938j3UNv"
              >
                <img
                  src="/images/discord.svg"
                  width={20}
                  className="mb-0.5 mr-1 inline-block"
                />
                Join our Discord server
              </a>
              ! This is the best way to get in touch with development, ask
              questions or suggest new features.
            </li>
            <li>
              <a
                className="underline"
                target="_blank"
                href="https://ko-fi.com/nordveil"
              >
                <img
                  src="/images/kofi.svg"
                  width={20}
                  className="mb-0.5 mr-1 inline-block"
                />
                Consider supporting us on Ko-Fi
              </a>{' '}
              if you like the project and want to help us keep it running.
            </li>
          </ul>
        </CardContent>
      </Card>
      <ClanInformation />
      <ClanPlayers />
    </AppLayout>
  );
}

export default Dashboard;
