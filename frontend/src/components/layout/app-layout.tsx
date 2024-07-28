import { PropsWithChildren } from 'react';
import MainNav from './main-nav';
import { Link } from '@tanstack/react-router';
import Logo from '../logo';
import UserNav from './user-nav';
import ThemeToggle from '../theme-toggle';

type Props = PropsWithChildren;

function AppLayout({ children }: Props) {
  return (
    <>
      <div>
        <div className="border-b">
          <div className="flex items-center justify-between px-4">
            <div className="flex h-12 items-center space-x-6">
              <Link to="/" className="flex items-center gap-2">
                <Logo />
                <span className="font-semibold">Clan Halls</span>
              </Link>
              <MainNav />
            </div>
            <div className="flex items-center space-x-6 justify-self-end">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:px-8 md:py-6">{children}</div>
    </>
  );
}

export default AppLayout;
