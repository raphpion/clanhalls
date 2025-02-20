import { createFileRoute } from '@tanstack/react-router';

import {
  handleOnboardingRedirection,
  ONBOARDING_STEPS,
} from '$helpers/onboarding';
import CreateOrJoinClan from '$pages/Onboarding/CreateOrJoinClan';

export const Route = createFileRoute('/onboarding/create-or-join-clan')({
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(
      context,
      location,
      ONBOARDING_STEPS.CREATE_CLAN,
    );
  },
  component: CreateOrJoinClan,
});
