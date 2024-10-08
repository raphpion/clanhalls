import { Fragment, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type ClanPlayerQueryParams, queryClanPlayers } from '$api/account';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$ui/select';

import Pager from '../common/Pager';
import View from '../common/View';

const IPP = 20;

function InactivePlayers() {
  const [inactiveFor, setInactiveFor] = useState<
    ClanPlayerQueryParams['inactiveFor'] | undefined
  >();
  const [page, setPage] = useState(1);

  const inactivePlayersQuery = useQuery({
    queryKey: ['inactive-players', inactiveFor, page],
    queryFn: () =>
      queryClanPlayers({
        search: '',
        orderBy: { field: 'lastSeenAt', order: 'ASC' },
        ipp: IPP,
        page,
        ...(inactiveFor && { inactiveFor }),
      }),
  });

  const handleInactiveForChange = (value: string) =>
    setInactiveFor(
      value !== 'undefined'
        ? (value as ClanPlayerQueryParams['inactiveFor'])
        : undefined,
    );

  const noContentText = (() => {
    switch (inactiveFor) {
      case '1week':
        return 'No players have been inactive for a week or more.';
      case '1month':
        return 'No players have been inactive for a month or more.';
      case '3months':
        return 'No players have been inactive for 3 months or more.';
      case '6months':
        return 'No players have been inactive for 6 months or more.';
      case '1year':
        return 'No players have been inactive for a year or more.';
      default:
        return 'No inactive players found.';
    }
  })();

  return (
    <Fragment>
      <Select value={`${inactiveFor}`} onValueChange={handleInactiveForChange}>
        <SelectTrigger className="mb-3 w-[240px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'undefined'}>Least recent players</SelectItem>
          <SelectItem value={'1week'}>Inactive for a week or more</SelectItem>
          <SelectItem value={'1month'}>Inactive for a month or more</SelectItem>
          <SelectItem value={'3months'}>
            Inactive for 3 months or more
          </SelectItem>
          <SelectItem value={'6months'}>
            Inactive for 6 months or more
          </SelectItem>
          <SelectItem value={'1year'}>Inactive for a year or more</SelectItem>
        </SelectContent>
      </Select>
      <View
        rows={IPP}
        data={inactivePlayersQuery.data?.items}
        loading={inactivePlayersQuery.isPending}
        noContentText={noContentText}
      />
      {inactivePlayersQuery.data?.totalCount &&
      inactivePlayersQuery.data.totalCount > IPP ? (
        <Pager
          ipp={IPP}
          page={page}
          totalCount={inactivePlayersQuery.data?.totalCount}
          onPageChange={setPage}
        />
      ) : null}
    </Fragment>
  );
}

export default InactivePlayers;
