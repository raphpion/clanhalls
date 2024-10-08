import { Skeleton } from '$ui/skeleton';
import { TableCell, TableRow } from '$ui/table';

type Props = {
  rows: number;
};

function Loading({ rows }: Props) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 3 }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-[14px] w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export default Loading;
