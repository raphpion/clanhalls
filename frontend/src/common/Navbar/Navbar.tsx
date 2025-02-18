import { Fragment } from 'react';

import { AlignLeftIcon, HomeIcon, MailPlusIcon } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '$ui/sheet';
import { Skeleton } from '$ui/skeleton';

import NavLink from './NavLink';
import UserMenu from './UserMenu';
import useAppContext from '../AppContext';
import AppLogo from '../AppLogo';
import { ThemeToggle } from '../Theme';

type Props = {
  mockNav?: boolean;
  mockUserMenu?: boolean;
};

function Navbar({ mockNav, mockUserMenu }: Props) {
  const { user } = useAppContext();

  if (!user) {
    return null;
  }

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
                  {user.isClanAdmin && (
                    <NavLink
                      to="/invitations"
                      icon={MailPlusIcon}
                      title="Invitations"
                      menu
                    />
                  )}
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
                {user.isClanAdmin && (
                  <NavLink
                    to="/invitations"
                    icon={MailPlusIcon}
                    title="Invitations"
                  />
                )}
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
