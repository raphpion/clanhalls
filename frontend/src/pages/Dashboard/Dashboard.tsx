import useAppContext from '$common/AppContext';
import AppLayout from '$common/AppLayout';
import { usePageTitle } from '$hooks';
import { Card, CardHeader, CardTitle } from '$ui/card';

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
      </Card>
      <ClanInformation />
      <ClanPlayers />
    </AppLayout>
  );
}

export default Dashboard;
