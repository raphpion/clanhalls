import { Fragment } from 'react';

import Loading from '../../Loading';
import Credential from './Credential';
import useCredentialsContext from './CredentialsContext';

function View() {
  const { loading, credentials } = useCredentialsContext();

  if (loading) {
    return <Loading />;
  }

  if (!credentials || !credentials.length) {
    return (
      <p>There are currently no credentials associated with your account.</p>
    );
  }

  return (
    <Fragment>
      <p className="mb-4">
        This is a list of credentials associated with your account that can be
        used to access the Clan Halls API. Remove any credentials that you do
        not recognize.
      </p>
      {credentials.map((credential, i) => (
        <Credential
          key={credential.clientId}
          credential={credential}
          isFirst={i === 0}
          isLast={i === credentials.length - 1}
        />
      ))}
    </Fragment>
  );
}

export default View;
