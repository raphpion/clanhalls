import { Fragment, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { type ClanPlayerQueryParams, queryClanPlayers } from '$api/account';
import { Input } from '$ui/input';

import Pager from '../common/Pager';
import View from '../common/View';

const IPP = 20;

function AllPlayers() {
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<ClanPlayerQueryParams['orderBy']>({
    field: 'rank',
    order: 'DESC',
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const allPlayersQuery = useQuery({
    queryKey: ['all-players', page, orderBy, debouncedSearch],
    queryFn: () =>
      queryClanPlayers({
        search: debouncedSearch,
        orderBy,
        ipp: IPP,
        page,
      }),
  });

  const handleOrderByChange = (
    field: ClanPlayerQueryParams['orderBy']['field'],
  ) => {
    setOrderBy((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <Fragment>
      <div className="relative mb-4 max-w-[200px]">
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
          type="search"
          placeholder="Search by username..."
        />
      </div>
      <View
        rows={IPP}
        data={allPlayersQuery.data?.items}
        loading={allPlayersQuery.isPending}
        orderBy={orderBy}
        noContentText="No players found"
        onOrderByLastSeenAt={() => handleOrderByChange('lastSeenAt')}
        onOrderByUsername={() => handleOrderByChange('username')}
        onOrderByRank={() => handleOrderByChange('rank')}
      />
      {allPlayersQuery.data?.totalCount &&
      allPlayersQuery.data.totalCount > IPP ? (
        <Pager
          ipp={IPP}
          page={page}
          totalCount={allPlayersQuery.data?.totalCount}
          onPageChange={setPage}
        />
      ) : null}
    </Fragment>
  );
}

export default AllPlayers;
