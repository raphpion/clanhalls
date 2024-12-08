import { ArrowDown, ArrowUp } from 'lucide-react';

import { Button } from '$ui/button';
import { TableHead } from '$ui/table';

type SortingParams = {
  orderBy: {
    field: string;
    order: 'ASC' | 'DESC';
  };
};

type Props<T extends SortingParams> = {
  title: string;
  field: T['orderBy']['field'];
  orderBy: T['orderBy'];
  onClick: (field: T['orderBy']['field']) => void;
};

function SortingTableHead<T extends SortingParams>({
  title,
  field,
  orderBy,
  onClick,
}: Props<T>) {
  const Icon = (() => {
    if (orderBy.field !== field) return null;
    if (orderBy.order === 'ASC') return ArrowUp;
    return ArrowDown;
  })();

  return (
    <TableHead>
      <Button variant="ghost" onClick={() => onClick(field)}>
        {title}
        {Icon && <Icon className="ml-2 h-4 w-4" />}
      </Button>
    </TableHead>
  );
}

export default SortingTableHead;
