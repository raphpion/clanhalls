import { AlignLeftIcon, HomeIcon } from 'lucide-react';
import { Fragment } from 'react';

import AppLogo from '../AppLogo';
import { ThemeToggle } from '../Theme';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '$ui/sheet';
import UserMenu from './UserMenu';
import NavLink from './NavLink';
import { Skeleton } from '$ui/skeleton';

type Props = {
  mockNav?: boolean;
  mockUserMenu?: boolean;
};

function Navbar({ mockNav, mockUserMenu }: Props) {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between px-4">
        {!mockNav && (
          <div className="flex h-12 sm:hidden">
            <Sheet>
              <SheetTrigger className="flex items-center">
                <AlignLeftIcon className="mr-2" />
                Menu
              </SheetTrigger>
              <SheetContent side="left" aria-describedby="navigation menu">
                <SheetHeader className="hidden">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="my-8 space-y-2">
                  <NavLink to="/" icon={HomeIcon} title="Dashboard" menu />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
        <div className="hidden h-12 items-center space-x-6 sm:flex">
          {!mockNav ? (
            <Fragment>
              <AppLogo withText />
              <div className="hidden h-12 items-center space-x-2 sm:flex">
                <NavLink to="/" icon={HomeIcon} title="Dashboard" />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Skeleton className="h-6 w-[111px] rounded-lg" />
              <div className="hidden h-12 items-center space-x-2 sm:flex">
                <Skeleton className="h-6 w-[124px] rounded-lg" />
              </div>
            </Fragment>
          )}
        </div>
        <div className="flex h-12 items-center space-x-6 justify-self-end">
          <ThemeToggle />
          {!mockUserMenu ? (
            <UserMenu />
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
