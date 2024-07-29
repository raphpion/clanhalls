import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { HomeIcon, UsersIcon } from 'lucide-react';
import { useMemo } from 'react';

const ITEMS = [
  {
    to: '/',
    icon: HomeIcon,
    label: 'Dashboard',
  },
  { to: '/clan', icon: UsersIcon, label: 'Clan' },
] as const;

function MainNav() {
  const location = useLocation();

  const links = useMemo(
    () =>
      ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn('flex items-center gap-2', {
            'text-blue-500': item.to !== location.pathname,
          })}
        >
          <item.icon size="1rem" />
          {item.label}
        </Link>
      )),
    [location.pathname],
  );

  return (
    <nav className="flex flex-col items-center gap-4 sm:flex-row lg:gap-6">
      {links}
    </nav>
  );
}

export default MainNav;
