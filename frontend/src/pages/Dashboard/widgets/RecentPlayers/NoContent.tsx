import { TableCell, TableRow } from '@/components/ui/table';

function NoContent() {
  return (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}

export default NoContent;
