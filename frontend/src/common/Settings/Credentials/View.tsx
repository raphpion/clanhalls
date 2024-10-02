import { Fragment } from 'react';

import { CheckCircle2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '$ui/alert';

import Credential from './Credential';
import useCredentialsContext from './CredentialsContext';
import CopyCredentials from '../../Credentials/CopyCredentials';
import Loading from '../../Loading';

function View() {
  const { loading, credentials, createdCredential, dismissCreatedCredential } =
    useCredentialsContext();

  if (loading) {
    return <Loading className="mx-auto" />;
  }

  if (!credentials || !credentials.length) {
    return (
      <p>There are currently no credentials associated with your account.</p>
    );
  }

  return (
    <Fragment>
      {createdCredential && (
        <Alert
          variant="success"
          className="mb-4"
          onDismiss={dismissCreatedCredential}
        >
          <AlertTitle className="mb-4 flex items-center">
            <CheckCircle2 className="h4 mr-2 inline-flex w-4" />
            Credential created successfully!
          </AlertTitle>
          <AlertDescription className="text-foreground">
            <CopyCredentials
              clientId={createdCredential.clientId}
              clientSecret={createdCredential.clientSecret}
            />
          </AlertDescription>
        </Alert>
      )}
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
