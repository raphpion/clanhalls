import { Fragment } from 'react/jsx-runtime';

import View from './View';
import Header from '../common/Header';

function Sessions() {
  return (
    <Fragment>
      <Header>
        <h2 className="text-2xl font-semibold">Sessions</h2>
      </Header>
      <View />
    </Fragment>
  );
}

export default Sessions;
