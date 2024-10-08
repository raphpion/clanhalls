import useAppContext from '$common/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '$ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '$ui/tabs';

import AllPlayers from './tabs/AllPlayers';
import InactivePlayers from './tabs/InactivePlayers';
import RecentPlayers from './tabs/RecentPlayers';

const TABS = [
  {
    key: 'recent-players',
    label: 'Recent Players',
    content: RecentPlayers,
  },
  {
    key: 'inactive-players',
    label: 'Inactive Players',
    content: InactivePlayers,
  },
  {
    key: 'all-players',
    label: 'All Players',
    content: AllPlayers,
  },
] as const;

function ClanPlayers() {
  const { user } = useAppContext();

  if (!user) return null;

  return (
    <Card className="w-full max-w-2xl">
      <Tabs defaultValue={TABS[0].key}>
        <TabsList className="grid w-full grid-cols-3">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent value={tab.key} key={tab.key}>
            <CardHeader>
              <CardTitle>{tab.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <tab.content />
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

export default ClanPlayers;
