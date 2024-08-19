import { Input } from '$ui/input';
import { Label } from '$ui/label';

import CopyButton from '../CopyButton';

type Props = {
  clientId: string;
  clientSecret: string;
};

function CopyCredentials({ clientId, clientSecret }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="clientId">Client ID</Label>
        <div className="flex items-center justify-center space-x-2">
          <Input id="clientId" type="text" value={clientId} readOnly />
          <CopyButton value={clientId} />
        </div>
      </div>
      <div>
        <Label htmlFor="clientSecret">Client secret</Label>
        <div className="flex items-center justify-center space-x-2">
          <Input
            id="clientSecret"
            type="password"
            value={clientSecret}
            readOnly
          />
          <CopyButton value={clientSecret} />
        </div>
      </div>
    </div>
  );
}

export default CopyCredentials;
