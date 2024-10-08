import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$ui/select';

type Props = {
  ipp: number;
  page: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

function Pager({ ipp, page, totalCount, onPageChange }: Props) {
  const totalPages = Math.ceil(totalCount / ipp);
  return (
    <div className="flex items-center gap-2">
      <div>Page</div>
      <Select
        value={`${page}`}
        onValueChange={(value) => onPageChange(Number(value))}
      >
        <SelectTrigger className="w-fit">
          <SelectValue>{page}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: totalPages }).map((_, index) => (
            <SelectItem
              key={index}
              value={`${index + 1}`}
              onSelect={() => onPageChange(index + 1)}
            >
              {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>of {totalPages}</div>
    </div>
  );
}

export default Pager;
