import { flexRender, type Table } from '@tanstack/react-table';

import { TableRow, TableCell } from '$ui/table';

import Loading from './Loading';
import NoContent from './NoContent';
import { type ClanPlayer } from './RecentPlayers';


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
