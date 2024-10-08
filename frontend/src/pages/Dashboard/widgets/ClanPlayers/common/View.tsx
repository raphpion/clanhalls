import { Fragment, useMemo } from 'react';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

import ClanTitleIcon from '$common/ClanTitleIcon';
import {
  Table,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
} from '$ui/table';

import Loading from './Loading';
import NoContent from './NoContent';
import { type ClanPlayerQueryParams } from '../../../../../api/account';
import { Button } from '../../../../../ui/button';

export type ClanPlayer = {
  username: string;
  title?: string;
  rank?: string;
  lastSeenAt?: string;
};

const getGolumns = (
  orderBy?: ClanPlayerQueryParams['orderBy'],
  onOrderByUsername?: () => void,
  onOrderByTitle?: () => void,
  onOrderByLastSeenAt?: () => void,
): ColumnDef<ClanPlayer>[] => [
  {
    accessorKey: 'username',
    id: 'username',
    header: () => (
      <Header
        field="username"
        title="Username"
        onClick={onOrderByUsername}
        orderBy={orderBy}
      />
    ),
  },
  {
    id: 'rank',
    accessorKey: 'rank',
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => (
      <Header
        field="rank"
        title="Title"
        onClick={onOrderByTitle}
        orderBy={orderBy}
      />
    ),
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
    header: () => (
      <Header
        field="lastSeenAt"
        title="Last Seen At"
        onClick={onOrderByLastSeenAt}
        orderBy={orderBy}
      />
    ),
    accessorFn: (row) =>
      row.lastSeenAt ? new Date(row.lastSeenAt).toLocaleString() : undefined,
  },
];

const getColumnVisibility = (columns: ColumnDef<ClanPlayer>[]) =>
  Object.fromEntries(
    columns.map((column) => [column.id, column.id !== 'rank']),
  );

type ViewProps = {
  data: ClanPlayer[] | undefined;
  rows: number;
  loading: boolean;
  orderBy?: ClanPlayerQueryParams['orderBy'];
  noContentText: string;
  onOrderByLastSeenAt?: () => void;
  onOrderByUsername?: () => void;
  onOrderByRank?: () => void;
};

type ContentProps = {
  table: ReturnType<typeof useReactTable<ClanPlayer>>;
  rows: number;
  loading: boolean;
  noContentText: string;
};

type HeaderProps = {
  field: ClanPlayerQueryParams['orderBy']['field'];
  title: string;
  orderBy?: ClanPlayerQueryParams['orderBy'];
  onClick?: () => void;
};

function Content({ table, rows, loading, noContentText }: ContentProps) {
  if (loading) return <Loading rows={rows} />;

  if (table.getRowCount() === 0) return <NoContent text={noContentText} />;

  return table.getRowModel().rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
}

function Header({ field, title, orderBy, onClick }: HeaderProps) {
  if (!onClick) return <Fragment>{title}</Fragment>;

  const Icon = (() => {
    if (orderBy?.field !== field) return null;

    return orderBy.order === 'ASC' ? ArrowUp : ArrowDown;
  })();

  return (
    <Button variant="ghost" onClick={onClick}>
      {title}
      {Icon && <Icon className="ml-2 h-4 w-4" />}
    </Button>
  );
}

function View({
  data,
  orderBy,
  onOrderByLastSeenAt,
  onOrderByUsername,
  onOrderByRank,
  ...contentProps
}: ViewProps) {
  const columns = useMemo(
    () =>
      getGolumns(
        orderBy,
        onOrderByUsername,
        onOrderByRank,
        onOrderByLastSeenAt,
      ),
    [orderBy, onOrderByLastSeenAt, onOrderByRank, onOrderByUsername],
  );

  const columnVisibility = getColumnVisibility(columns);

  const table = useReactTable<ClanPlayer>({
    columns,
    data: data || [],
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (sorting) => {
      console.log(sorting);
    },
  });

  return (
    <Table className="mb-4">
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
        <Content table={table} {...contentProps} />
      </TableBody>
    </Table>
  );
}

export default View;
