import AppLayout from '@/components/layout/app-layout';
import AppContext from '@/context';
import { useContext } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import RecentPlayers from './widgets/RecentPlayers';

function Dashboard() {
  const { user } = useContext(AppContext);
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
      <RecentPlayers />
    </AppLayout>
  );
}

export default Dashboard;
