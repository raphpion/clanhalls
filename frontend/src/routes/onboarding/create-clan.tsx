import { createFileRoute } from '@tanstack/react-router';
import {
  handleOnboardingRedirection,
  ONBOARDING_STEPS,
} from '$helpers/onboarding';
import CreateClan from '$pages/Onboarding/CreateClan';

export const Route = createFileRoute('/onboarding/create-clan')({
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(
      context,
      location,
      ONBOARDING_STEPS.CREATE_CLAN,
    );
  },
  component: CreateClan,
});

