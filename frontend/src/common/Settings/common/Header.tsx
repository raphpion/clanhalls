import { Fragment, PropsWithChildren } from 'react';
import { Separator } from '$ui/separator';

type Props = PropsWithChildren<{}>;

function Header({ children }: Props) {
  return (
    <Fragment>
      {children}
      <Separator className="mb-3 mt-2" />
    </Fragment>
  );
}

export default Header;
