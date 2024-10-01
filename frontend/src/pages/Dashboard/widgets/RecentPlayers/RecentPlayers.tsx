import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { queryClanPlayers } from '$api/account';
import useAppContext from '$common/AppContext';
import ClanTitleIcon from '$common/ClanTitleIcon';
import { Button } from '$ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '$ui/table';

import View from './View';

export type ClanPlayer = {
  username: string;
  title?: string;
  rank?: string;
  lastSeenAt?: string;
};

const columns: ColumnDef<ClanPlayer>[] = [
  {
    accessorKey: 'username',
    id: 'username',
    header: 'Username',
  },
  {
    id: 'rank',
    accessorKey: 'rank',
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue<string>('title');
      const rank = row.getValue<string>('rank');

      if (!title && !rank) return null;

      if (!title) return rank;

      return (
        <div className="flex items-center space-x-2">
          <ClanTitleIcon title={title} />
          <span>{title}</span>
        </div>
      );
    },
  },
  {
    id: 'lastSeenAt',
    accessorKey: 'lastSeenAt',
    header: 'Last Seen At',
    accessorFn: (row) =>
      row.lastSeenAt ? new Date(row.lastSeenAt).toLocaleString() : undefined,
  },
];

const columnVisibility = Object.fromEntries(
  columns.map((column) => [column.id, column.id !== 'rank']),
);

function RecentPlayers() {
  const { user } = useAppContext();

  const clanPlayersQuery = useQuery({
    queryKey: ['clan-players'],
    queryFn: () =>
      queryClanPlayers({
        search: '',
        orderBy: { field: 'lastSeenAt', order: 'DESC' },
        ipp: 10,
      }),
  });

  const table = useReactTable<ClanPlayer>({
    columns,
    data: clanPlayersQuery.data?.items || [],
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
  });

  if (!user) return null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Recent Players</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <View table={table} loading={clanPlayersQuery.isPending} />
          </TableBody>
        </Table>
      </CardContent>
      {clanPlayersQuery.data?.items.length ? (
        <CardFooter>
          <Button variant="outline">View all clan players</Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export default RecentPlayers;
