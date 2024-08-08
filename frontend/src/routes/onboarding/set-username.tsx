import { createFileRoute } from '@tanstack/react-router';
import SetUsername from '$pages/Onboarding/SetUsername';
import {
  handleOnboardingRedirection,
  ONBOARDING_STEPS,
} from '$helpers/onboarding';

export const Route = createFileRoute('/onboarding/set-username')({
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(
      context,
      location,
      ONBOARDING_STEPS.SET_USERNAME,
    );
  },
  component: SetUsername,
});
