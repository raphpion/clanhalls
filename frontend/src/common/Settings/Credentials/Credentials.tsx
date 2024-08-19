import View from './View';
import { CredentialsContextProvider } from './CredentialsContext';
import Header from '../common/Header';

function Credentials() {
  return (
    <CredentialsContextProvider>
      <Header>
        <h2 className="text-2xl font-semibold">Credentials</h2>
      </Header>
      <View />
    </CredentialsContextProvider>
  );
}

export default Credentials;
