import { LaptopMinimalIcon } from 'lucide-react';

import { Button } from '$ui/button';
import { Card } from '$ui/card';
import { cn } from '$ui/utils';

import useSessionsContext from './SessionsContext';
import { type ActiveSessionData } from '../../../api/account';
import useConfirmationDialog from '../../ConfirmationDialog/ConfirmationDialogContext';

type Props = {
  session: ActiveSessionData;
  isFirst?: boolean;
  isLast?: boolean;
};

function Session({ session, isFirst, isLast }: Props) {
  const { askConfirmation } = useConfirmationDialog();
  const { revokeSession, refetch } = useSessionsContext();

  const handleClickRevoke = async () => {
    if (session.isCurrent) {
      const confirmed = await askConfirmation({
        title: 'Revoke current session?',
        description:
          'Are you sure you want to revoke your current session? This will log you out of the application.',
        confirmLabel: 'Yes, sign me out',
      });

      if (!confirmed) return;
    }

    await revokeSession(session.uuid);

    if (session.isCurrent) {
      window.location.reload();
      return;
    }

    refetch();
  };

  return (
    <Card
      className={cn('rounded-none p-4', {
        'rounded-t-lg': isFirst,
        'rounded-b-lg': isLast,
        'border-t-0': !isFirst,
      })}
    >
      <div className="flex flex-row items-center space-x-4">
        <LaptopMinimalIcon size={32} absoluteStrokeWidth />
        <div className="flex-1">
          <p className="text-lg font-semibold">{session.ipAddress}</p>
          <p>{session.userAgent}</p>
          {session.isCurrent && (
            <p className="text-sm text-muted-foreground">
              Your current session
            </p>
          )}
        </div>
        <div>
          <Button variant="outline" onClick={handleClickRevoke}>
            Revoke
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Session;
