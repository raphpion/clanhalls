import { Fragment } from 'react/jsx-runtime';

import { Button } from '$ui/button';

import useSessionsContext from './context';
import View from './View';
import useConfirmationDialog from '../../ConfirmationDialog/ConfirmationDialogContext';
import Header from '../common/Header';

function Sessions() {
  const { revokeAllSessions } = useSessionsContext();
  const { askConfirmation } = useConfirmationDialog();

  const handleClickRevokeAllSessions = async () => {
    const confirmed = await askConfirmation({
      title: 'Revoke all sessions?',
      description:
        'Are you sure you want to revoke all sessions? This will log you out of the application on all devices.',
      confirmLabel: 'Yes, sign me out',
    });

    if (!confirmed) return;

    return revokeAllSessions();
  };

  return (
    <Fragment>
      <Header>
        <h2 className="text-2xl font-semibold">Sessions</h2>
        <Button size="xs" onClick={handleClickRevokeAllSessions}>
          Revoke all sessions
        </Button>
      </Header>
      <View />
    </Fragment>
  );
}

export default Sessions;
