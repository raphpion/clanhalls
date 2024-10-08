import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

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

type ViewProps = {
  data: ClanPlayer[] | undefined;
  rows: number;
  loading: boolean;
  noContentText: string;
};

type ContentProps = {
  table: ReturnType<typeof useReactTable<ClanPlayer>>;
  rows: number;
  loading: boolean;
  noContentText: string;
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

function View({ data, ...contentProps }: ViewProps) {
  const table = useReactTable<ClanPlayer>({
    columns,
    data: data || [],
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
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
