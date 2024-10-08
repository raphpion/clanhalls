import { useQuery } from '@tanstack/react-query';

import { queryClanPlayers } from '$api/account';

import View from '../common/View';

export type ClanPlayer = {
  username: string;
  title?: string;
  rank?: string;
  lastSeenAt?: string;
};

const IPP = 10;

function RecentPlayers() {
  const clanPlayersQuery = useQuery({
    queryKey: ['clan-players'],
    queryFn: () =>
      queryClanPlayers({
        search: '',
        orderBy: { field: 'lastSeenAt', order: 'DESC' },
        ipp: IPP,
      }),
  });

  return (
    <View
      rows={IPP}
      data={clanPlayersQuery.data?.items}
      loading={clanPlayersQuery.isPending}
      noContentText="No recent players"
    />
  );
}

export default RecentPlayers;
