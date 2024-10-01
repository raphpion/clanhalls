import { createFileRoute } from '@tanstack/react-router';

import {
  handleOnboardingRedirection,
  ONBOARDING_STEPS,
} from '$helpers/onboarding';
import SetUsername from '$pages/Onboarding/SetUsername';

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
