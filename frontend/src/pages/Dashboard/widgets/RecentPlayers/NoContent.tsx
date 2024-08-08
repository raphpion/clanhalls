import { TableCell, TableRow } from '$ui/table';

function NoContent() {
  return (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        No recent members.
      </TableCell>
    </TableRow>
  );
}

export default NoContent;
