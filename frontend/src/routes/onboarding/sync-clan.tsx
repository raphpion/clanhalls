import { createFileRoute } from '@tanstack/react-router';
import SyncClan from '$pages/Onboarding/SyncClan/SyncClan';
import {
  handleOnboardingRedirection,
  ONBOARDING_STEPS,
} from '$helpers/onboarding';

export const Route = createFileRoute('/onboarding/sync-clan')({
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(context, location, ONBOARDING_STEPS.SYNC_CLAN);
  },
  component: SyncClan,
});

