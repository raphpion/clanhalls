import { Fragment } from 'react/jsx-runtime';

import { Button } from '$ui/button';

import useCredentialsContext, {
  CredentialsContextProvider,
} from './CredentialsContext';
import View from './View';
import Header from '../common/Header';

function CredentialsContent() {
  const { openCreateSlideOut } = useCredentialsContext();

  return (
    <Fragment>
      <Header>
        <h2 className="text-2xl font-semibold">Credentials</h2>
        <Button size="xs" onClick={openCreateSlideOut}>
          Create new credential
        </Button>
      </Header>
      <View />
    </Fragment>
  );
}

function Credentials() {
  return (
    <CredentialsContextProvider>
      <CredentialsContent />
    </CredentialsContextProvider>
  );
}

export default Credentials;
