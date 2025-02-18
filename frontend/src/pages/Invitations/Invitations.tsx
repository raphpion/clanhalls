import { Fragment, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import {
  type ClanInvitationsQueryParams,
  queryClanInvitations,
} from '$api/account';
import useAppContext from '$common/AppContext';
import AppLayout from '$common/AppLayout';
import { SortingTableHead } from '$common/Table';
import { Avatar, AvatarImage } from '$ui/avatar';
import { Button } from '$ui/button';
import { Skeleton } from '$ui/skeleton';
import {
  Table,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
} from '$ui/table';

import CreateOrEditInvitation from './CreateOrEditInvitation';
import CopyButton from '../../common/CopyButton';
import Pager from '../Dashboard/widgets/ClanPlayers/common/Pager';

const IPP = 50;

function Invitations() {
  const { user } = useAppContext();
  const [createOrEditSlideOutOpen, setCreateOrEditSlideOutOpen] =
    useState(false);

  const [page, setPage] = useState(1);
  const [disabled, setDisabled] = useState<boolean | undefined>(undefined);
  const [expired, setExpired] = useState<boolean | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<ClanInvitationsQueryParams['orderBy']>(
    {
      field: 'sender',
      order: 'DESC',
    },
  );
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const invitationsQuery = useQuery({
    queryKey: ['invitations'],
    queryFn: () =>
      queryClanInvitations({
        search: debouncedSearch,
        orderBy,
        ipp: IPP,
        page,
        disabled,
        expired,
      }),
  });

  if (!user) return null;

  const handleOpenCreate = () => {
    setCreateOrEditSlideOutOpen(true);
  };

  const handleOrderByChange = (
    field: ClanInvitationsQueryParams['orderBy']['field'],
  ) =>
    setOrderBy((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));

  return (
    <Fragment>
      <AppLayout>
        <div className="flex w-full flex-row justify-between">
          <h1 className="mb-8 text-3xl font-bold">Invitations</h1>
          <Button variant="default" onClick={handleOpenCreate}>
            Create invitation
          </Button>
        </div>
        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <SortingTableHead<ClanInvitationsQueryParams>
                field="sender"
                title="Sent by"
                orderBy={orderBy}
                onClick={handleOrderByChange}
              />
              <TableHead>Invite code</TableHead>
              <SortingTableHead<ClanInvitationsQueryParams>
                field="description"
                title="Description"
                orderBy={orderBy}
                onClick={handleOrderByChange}
              />
              <SortingTableHead<ClanInvitationsQueryParams>
                field="uses"
                title="Uses"
                orderBy={orderBy}
                onClick={handleOrderByChange}
              />
              <SortingTableHead<ClanInvitationsQueryParams>
                field="maxUses"
                title="Max Uses"
                orderBy={orderBy}
                onClick={handleOrderByChange}
              />
              <SortingTableHead<ClanInvitationsQueryParams>
                field="expiresAt"
                title="Expires"
                orderBy={orderBy}
                onClick={handleOrderByChange}
              />
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitationsQuery.isFetching &&
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-[14px] w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!invitationsQuery.isFetching &&
              invitationsQuery.data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No invitations found.
                  </TableCell>
                </TableRow>
              )}
            {!invitationsQuery.isFetching &&
              invitationsQuery.data?.items.length &&
              invitationsQuery.data.items.map((invitation) => (
                <TableRow key={invitation.uuid}>
                  <TableCell className="flex items-center gap-4 font-semibold">
                    <Avatar>
                      <AvatarImage
                        src={invitation.sender.pictureUrl || ''}
                        alt={invitation.sender.username || ''}
                      />
                    </Avatar>
                    {user.username || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <pre>{invitation.uuid}</pre>
                      <CopyButton value={invitation.uuid} />
                    </div>
                  </TableCell>
                  <TableCell>{invitation.description || '-'}</TableCell>
                  <TableCell>{invitation.uses}</TableCell>
                  <TableCell>{invitation.maxUses || '∞'}</TableCell>
                  <TableCell>{invitation.expiresAt?.toString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {invitationsQuery.data?.totalCount &&
        invitationsQuery.data.totalCount > IPP ? (
          <Pager
            ipp={IPP}
            page={page}
            totalCount={invitationsQuery.data?.totalCount}
            onPageChange={setPage}
          />
        ) : null}
      </AppLayout>
      <CreateOrEditInvitation
        open={createOrEditSlideOutOpen}
        onOpenChange={setCreateOrEditSlideOutOpen}
      />
    </Fragment>
  );
}

export default Invitations;
