import { PropsWithChildren } from 'react';
import { Navbar } from '..';

type Props = PropsWithChildren;

function AppLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="p-4 md:px-8 md:py-6">{children}</div>
    </>
  );
}

export default AppLayout;
