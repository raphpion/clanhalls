import { flexRender, Table } from '@tanstack/react-table';
import { ClanPlayer } from './RecentPlayers';
import Loading from './Loading';
import NoContent from './NoContent';
import { TableRow, TableCell } from '$ui/table';

type Props = {
  table: Table<ClanPlayer>;
  loading?: boolean;
};

function View({ loading = false, table }: Props) {
  if (loading) return <Loading />;

  if (!table.getRowModel().rows?.length) return <NoContent />;

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

export default View;
