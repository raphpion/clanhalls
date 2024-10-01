import { createFileRoute } from '@tanstack/react-router';

import {
  handleOnboardingRedirection,
  ONBOARDING_STEPS,
} from '$helpers/onboarding';
import SyncClan from '$pages/Onboarding/SyncClan';

export const Route = createFileRoute('/onboarding/sync-clan')({
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(context, location, ONBOARDING_STEPS.SYNC_CLAN);
  },
  component: SyncClan,
});
