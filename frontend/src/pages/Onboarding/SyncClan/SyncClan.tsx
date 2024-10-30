import { Fragment, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  createCredentials,
  type CreateCredentialsData,
  getClan,
  getCredentials,
} from '$api/account';
import useAppContext from '$common/AppContext';
import CopyCredentials from '$common/Credentials/CopyCredentials';
import Loading from '$common/Loading';
import OnboardingLayout from '$common/OnboardingLayout';
import {
  CredentialScopes,
  type Scopes,
  scopesToString,
} from '$helpers/credentials';
import { usePageTitle } from '$hooks';
import { Button } from '$ui/button';
import { Checkbox } from '$ui/checkbox';
import { Label } from '$ui/label';

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
  }, [createCredentialsMutation, getCredentialsQuery.data]);

  useEffect(() => {
    if (getClanQuery.data === undefined) return;

    if (getClanQuery.data?.lastSyncedAt) {
      navigate({ to: '/' });
    }
  }, [getClanQuery.data, navigate]);

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
          <p className="mb-6">
            You will need these credentials to sync your clan with Clan Halls.
            You can only view them once, so make sure to save them somewhere
            safe.
          </p>
          <CopyCredentials
            clientId={credentials.clientId}
            clientSecret={credentials.clientSecret}
          />
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
          <p className="mb-4 text-center">Awaiting synchronization...</p>
          <div className="mb-2 flex justify-center">
            <Loading />
          </div>
        </Fragment>
      )}
    </OnboardingLayout>
  );
}

export default SyncClan;
