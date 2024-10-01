import { Fragment, type PropsWithChildren } from 'react';

import { Separator } from '$ui/separator';

type Props = PropsWithChildren;

function Header({ children }: Props) {
  return (
    <Fragment>
      <div className="flex w-full flex-row items-center justify-between">
        {children}
      </div>
      <Separator className="mb-3 mt-2" />
    </Fragment>
  );
}

export default Header;
