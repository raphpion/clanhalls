import { Link, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

const ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/clan', label: 'Clan' },
] as const;

function MainNav() {
  const location = useLocation();

  const links = useMemo(
    () =>
      ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={item.to === location.pathname ? '' : 'text-blue-500'}
        >
          {item.label}
        </Link>
      )),
    [location.pathname],
  );

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">{links}</nav>
  );
}

export default MainNav;
