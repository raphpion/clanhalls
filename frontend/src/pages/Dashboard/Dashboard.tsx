import AppLayout from '@/components/layout/app-layout';
import AppContext from '@/context';
import { useContext } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardTitle } from '@/components/ui/card';

function Dashboard() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  usePageTitle('Dashboard');

  if (!user) return null;

  return (
    <AppLayout>
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <Card className="b-none max-w-4xl bg-gradient-to-tr from-purple-400 to-blue-400 p-4 text-white">
        <CardTitle>Welcome, {user.username}! 👋</CardTitle>
      </Card>
    </AppLayout>
  );
}

export default Dashboard;
