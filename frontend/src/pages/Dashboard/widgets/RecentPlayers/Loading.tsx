import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const ROWS = 10;

function Loading() {
  return Array.from({ length: ROWS }).map((_, i) => (
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
