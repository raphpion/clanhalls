import { Card, CardContent, CardHeader, CardTitle } from '$ui/card';
import { Skeleton } from '$ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '$ui/table';
import { PropsWithChildren } from 'react';
import Navbar from '../Navbar';
import useAppContext from '../AppContext';

const ROWS = 10;
const COLUMNS = 3;

type Props = PropsWithChildren<{
  title: string;
}>;

function OnboardingLayout({ title, children }: Props) {
  const { user } = useAppContext();

  return (
    <div className="min-h-screen">
      <div className="absolute inset-x-0 bottom-0 top-12 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{title}</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
      <Navbar mockNav mockUserMenu={!user?.username} />
      <div className="p-4 md:px-8 md:py-6">
        <Skeleton className="mb-8 h-9 w-[160px]" />
        <Card className="b-none mb-8 max-w-4xl bg-gradient-to-tr from-purple-400 to-blue-400 text-white">
          <CardHeader>
            <Skeleton className="h-8 w-[190px]" />
          </CardHeader>
        </Card>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-[160px]" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: COLUMNS }).map((_, j) => (
                    <TableHead key={j}>
                      <Skeleton className="h-[14px] w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: ROWS }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: COLUMNS }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-[14px] w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OnboardingLayout;
