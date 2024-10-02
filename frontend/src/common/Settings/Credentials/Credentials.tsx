import { Fragment } from 'react/jsx-runtime';

import { Button } from '$ui/button';

import useCredentialsContext from './CredentialsContext';
import View from './View';
import Header from '../common/Header';

function Credentials() {
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

export default Credentials;
