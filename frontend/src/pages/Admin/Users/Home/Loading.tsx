import { Skeleton } from '$ui/skeleton';
import { TableCell, TableRow } from '$ui/table';

type Props = {
  columns: number;
  rows: number;
};

function Loading({ columns, rows }: Props) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: columns }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-[14px] w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export default Loading;
