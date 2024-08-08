import { createFileRoute } from '@tanstack/react-router';
import SignIn from '$pages/SignIn';
import {
  handleOnboardingRedirection,
  ONBOARDING_STEPS,
} from '../helpers/onboarding';

export const Route = createFileRoute('/sign-in')({
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(context, location, ONBOARDING_STEPS.SIGN_IN);
  },
  component: SignIn,
});
