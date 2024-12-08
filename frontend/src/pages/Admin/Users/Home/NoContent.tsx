import { TableCell, TableRow } from '$ui/table';

type Props = {
  text: string;
  columns: number;
};

function NoContent({ text, columns }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={columns} className="h-24 text-center">
        {text}
      </TableCell>
    </TableRow>
  );
}

export default NoContent;
