import { Fragment, PropsWithChildren } from 'react';
import Navbar from '../Navbar';

type Props = PropsWithChildren;

function AppLayout({ children }: Props) {
  return (
    <Fragment>
      <Navbar />
      <div className="p-4 md:px-8 md:py-6">{children}</div>
    </Fragment>
  );
}

export default AppLayout;
