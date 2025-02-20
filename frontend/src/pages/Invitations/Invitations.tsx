import { Fragment, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { BanIcon, SearchIcon } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import {
  type ClanInvitationsQueryParams,
  disableClanInvitation,
  queryClanInvitations,
} from '$api/account';
import useAppContext from '$common/AppContext';
import AppLayout from '$common/AppLayout';
import { useConfirmationDialog } from '$common/ConfirmationDialog';
import CopyButton from '$common/CopyButton';
import { SortingTableHead } from '$common/Table';
import { formatDateToLocal } from '$helpers/dates';
import { Avatar, AvatarFallback, AvatarImage } from '$ui/avatar';
import { Button } from '$ui/button';
import { useToast } from '$ui/hooks/use-toast';
import { Input } from '$ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$ui/select';
import { Skeleton } from '$ui/skeleton';
import {
  Table,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
} from '$ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '$ui/tooltip';

import CreateInvitation from './CreateInvitation';
import Pager from '../Dashboard/widgets/ClanPlayers/common/Pager';

const IPP = 50;

const STATUSES = [
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled' },
  { key: 'expired', label: 'Expired' },
  { key: 'used', label: 'Used up' },
] as const;

type Status = (typeof STATUSES)[number]['key'];

function Invitations() {
  const { user } = useAppContext();
  const { askConfirmation } = useConfirmationDialog();
  const { toast, genericErrorToast } = useToast();

  const [createSlideOutOpen, setCreateSlideOutOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<Status>('active');
  const [orderBy, setOrderBy] = useState<ClanInvitationsQueryParams['orderBy']>(
    {
      field: 'sender',
      order: 'DESC',
    },
  );
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const [disabled, expired, used] = (() => {
    switch (status) {
      case 'used':
        return [false, false, true];
      case 'disabled':
        return [true, false, false];
      case 'expired':
        return [false, true, false];
      case 'active':
      default:
        return [false, false, false];
    }
  })();

  const invitationsQuery = useQuery({
    queryKey: ['invitations', debouncedSearch, orderBy, page, status],
    queryFn: () =>
      queryClanInvitations({
        search: debouncedSearch,
        orderBy,
        ipp: IPP,
        page,
        disabled,
        expired,
        used,
      }),
  });

  const disableClanInvitationMutation = useMutation({
    mutationKey: ['disable-clan-invitation'],
    mutationFn: disableClanInvitation,
    onMutate: () => {
      toast({
        title: 'Creating credential...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Credential created successfully!',
        variant: 'success',
      });
    },
    onError: genericErrorToast,
  });

  if (!user) return null;

  const handleOpenCreate = () => {
    setCreateSlideOutOpen(true);
  };

  const handleOrderByChange = (
    field: ClanInvitationsQueryParams['orderBy']['field'],
  ) =>
    setOrderBy((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));

  const handleClickDisable = async (uuid: string) => {
    const confirmed = await askConfirmation({
      title: 'Disable invitation',
      description: `Are you sure you want to disable this invitation? Users won't be able to use this code to join your clan anymore. This action cannot be undone.`,
      confirmLabel: 'Yes, disable invitation',
      confirmVariant: 'destructive',
    });

    if (!confirmed) return;

    await disableClanInvitationMutation.mutateAsync(uuid);

    invitationsQuery.refetch();
  };

  const showBlankState = Boolean(
    !invitationsQuery.isFetching && !invitationsQuery.data?.items.length,
  );
  const showContent = Boolean(
    !invitationsQuery.isFetching && invitationsQuery.data,
  );
  const showPager = Boolean(
    invitationsQuery.data?.totalCount && invitationsQuery.data.totalCount > IPP,
  );

  return (
    <Fragment>
      <AppLayout>
        <div className="flex w-full flex-row justify-between">
          <h1 className="mb-8 text-3xl font-bold">Invitations</h1>
          <Button variant="default" onClick={handleOpenCreate}>
            Create invitation
          </Button>
        </div>
        <div className="mb-4 flex flex-row items-center gap-4">
          <div className="relative max-w-[200px]">
            <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              type="search"
              placeholder="Search by description..."
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as Status)}
          >
            <SelectTrigger className="w-fit">
              <SelectValue>
                <div className="pr-4">
                  {STATUSES.find((s) => s.key === status)?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.key} value={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                field="expiresAt"
                title={expired ? 'Expired' : 'Expires'}
                orderBy={orderBy}
                onClick={handleOrderByChange}
              />
              {status === 'active' && <TableHead className="w-0" />}
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
            {showBlankState && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No invitations found.
                </TableCell>
              </TableRow>
            )}
            {showContent &&
              invitationsQuery.data!.items.map((invitation) => (
                <TableRow key={invitation.uuid}>
                  <TableCell className="flex items-center gap-4 font-semibold">
                    <Avatar>
                      <AvatarImage
                        src={invitation.sender.pictureUrl || ''}
                        alt={invitation.sender.username || ''}
                      />
                      {user.username && (
                        <AvatarFallback>
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {user.username || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <pre>{invitation.code}</pre>
                      <CopyButton value={invitation.code} />
                    </div>
                  </TableCell>
                  <TableCell>{invitation.description || '-'}</TableCell>
                  <TableCell>
                    {invitation.maxUses
                      ? `${invitation.uses}/${invitation.maxUses}`
                      : invitation.uses}
                  </TableCell>
                  <TableCell>
                    {invitation.expiresAt
                      ? formatDateToLocal(invitation.expiresAt, true)
                      : 'Never'}
                  </TableCell>
                  {status === 'active' && (
                    <TableCell>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleClickDisable(invitation.uuid)
                              }
                            >
                              <BanIcon size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Disable</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {showPager && (
          <Pager
            ipp={IPP}
            page={page}
            totalCount={invitationsQuery.data!.totalCount!}
            onPageChange={setPage}
          />
        )}
      </AppLayout>
      <CreateInvitation
        open={createSlideOutOpen}
        onOpenChange={setCreateSlideOutOpen}
      />
    </Fragment>
  );
}

export default Invitations;
