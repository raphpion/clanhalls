import { useMutation, useQuery } from '@tanstack/react-query';

import { CopyButton, Loading, OnboardingLayout, useAppContext } from '$common';
import {
  createCredentials,
  CreateCredentialsData,
  getClan,
  getCredentials,
} from '$api/account';
import { Fragment, useEffect, useState } from 'react';
import { CredentialScopes, Scopes, scopesToString } from '$helpers/credentials';
import { usePageTitle } from '$hooks';
import { Button } from '$ui/button';
import { Checkbox } from '$ui/checkbox';
import { Input } from '$ui/input';
import { Label } from '$ui/label';
import { useNavigate } from '@tanstack/react-router';

function SyncClan() {
  usePageTitle('Sync your clan');
  const { clan } = useAppContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<CreateCredentialsData>();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [readyForSync, setReadyForSync] = useState(true);

  const getCredentialsQuery = useQuery({
    queryKey: ['get-credentials'],
    queryFn: getCredentials,
  });

  const getClanQuery = useQuery({
    queryKey: ['get-clan'],
    queryFn: getClan,
    refetchInterval: 5000,
    enabled: readyForSync,
  });

  const createCredentialsMutation = useMutation({
    mutationKey: ['create-credentials'],
    mutationFn: createCredentials,
  });

  useEffect(() => {
    (async () => {
      if (getCredentialsQuery.data === undefined) return;

      if (getCredentialsQuery.data.length > 0) {
        setLoading(false);
        setReadyForSync(true);
        return;
      }

      setReadyForSync(false);

      const scopes = {} as Scopes;
      scopes[CredentialScopes.CLAN_REPORTING] = true;

      const credentials = await createCredentialsMutation.mutateAsync({
        name: 'Onboarding',
        scope: scopesToString(scopes),
      });

      setCredentials(credentials);
      setLoading(false);
    })();
  }, [getCredentialsQuery.data]);

  useEffect(() => {
    if (getClanQuery.data === undefined) return;

    if (getClanQuery.data?.lastSyncedAt) {
      navigate({ to: '/' });
    }
  }, [getClanQuery.data]);

  if (!clan) return null;

  return (
    <OnboardingLayout title="Sync your clan">
      {loading && (
        <div className="flex h-[200px] flex-col items-center justify-center">
          <Loading />
        </div>
      )}
      {credentials && !readyForSync && (
        <Fragment>
          <p>
            You will need these credentials to sync your clan with Clan Halls.
            You can only view them once, so make sure to save them somewhere
            safe.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="clientId">Client ID</Label>
              <div className="flex items-center justify-center space-x-2">
                <Input
                  id="clientId"
                  type="text"
                  value={credentials.clientId}
                  readOnly
                />
                <CopyButton value={credentials.clientId} />
              </div>
            </div>
            <div>
              <Label htmlFor="clientSecret">Client secret</Label>
              <div className="flex items-center justify-center space-x-2">
                <Input
                  id="clientSecret"
                  type="password"
                  value={credentials.clientSecret}
                  readOnly
                />
                <CopyButton value={credentials.clientSecret} />
              </div>
            </div>
          </div>
          <div className="mb-8 mt-4 flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={confirmChecked}
              onCheckedChange={(checked) => setConfirmChecked(checked === true)}
            />
            <Label htmlFor="confirm" className="text-sm">
              I have saved these credentials in a safe place.
            </Label>
          </div>
          <div className="text-center">
            <Button
              onClick={() => setReadyForSync(true)}
              disabled={!confirmChecked}
            >
              Continue
            </Button>
          </div>
        </Fragment>
      )}
      {!loading && readyForSync && (
        <Fragment>
          <p className="mb-4 text-center">
            Awaiting synchronization...
            <Button
              variant="link"
              onClick={() => getClanQuery.refetch({ cancelRefetch: true })}
            >
              Refresh
            </Button>
          </p>
          <div className="mb-2 flex justify-center">
            <Loading />
          </div>
        </Fragment>
      )}
    </OnboardingLayout>
  );
}

export default SyncClan;
