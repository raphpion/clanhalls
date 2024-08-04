import { Link, LinkProps, useLocation } from '@tanstack/react-router';
import { LucideIcon } from 'lucide-react';
import { cn } from '$ui/utils';
import { ComponentProps } from 'react';

type ToPathOption = LinkProps['to'];

type Props = {
  to: ToPathOption;
  icon: LucideIcon;
  title: string;
  menu?: boolean;
};

function NavLink({ to, icon: Icon, title, menu }: Props) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn('flex items-center rounded-lg p-2 transition', {
        'gap-4 p-2': menu,
        'gap-2 px-2 py-1': !menu,
        'hover:bg-teal-100 dark:hover:bg-teal-900': !active,
      })}
      disabled={active}
      activeProps={{
        className: 'bg-teal-50 dark:bg-teal-950',
      }}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900">
        <Icon
          className={cn({ 'text-slate-700 dark:text-slate-200': !menu })}
          size="1rem"
        />
      </span>
      {title}
    </Link>
  );
}

export default NavLink;
