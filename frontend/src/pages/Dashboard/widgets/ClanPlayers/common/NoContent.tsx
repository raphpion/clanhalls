import { TableCell, TableRow } from '$ui/table';

type Props = {
  text: string;
};

function NoContent({ text }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        {text}
      </TableCell>
    </TableRow>
  );
}

export default NoContent;
