import { HTMLAttributes } from 'react';
import { cn } from '$ui/utils';
import { Link } from '@tanstack/react-router';

type Props = HTMLAttributes<'a'> & {
  size?: number;
  withText?: boolean;
};

function AppLogo({ className, size = 32, withText, ...props }: Props) {
  const styles = cn('flex items-center gap-2', className);

  return (
    <Link {...props} className={styles}>
      <img src="/logo.svg" alt="logo" width={size} />
      {withText && <span className="font-semibold">Clan Halls</span>}
    </Link>
  );
}

export default AppLogo;
