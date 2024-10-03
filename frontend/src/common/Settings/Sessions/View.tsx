import { Fragment } from 'react';

import useSessionsContext from './context';
import Session from './Session';
import Loading from '../../Loading';

function View() {
  const { loading, sessions } = useSessionsContext();

  if (loading) {
    return <Loading className="mx-auto" />;
  }

  if (!sessions || !sessions.length) {
    return (
      <p>
        There are currently no sessions associated with your account. This
        should not be happening, but hey, you should probably refresh your
        browser! 😜
      </p>
    );
  }

  return (
    <Fragment>
      <p className="mb-4">
        This is a list of devices that have logged into your account. Revoke any
        sessions that you do not recognize.
      </p>
      {sessions.map((session, i) => (
        <Session
          key={session.uuid}
          session={session}
          isFirst={i === 0}
          isLast={i === sessions.length - 1}
        />
      ))}
    </Fragment>
  );
}

export default View;
