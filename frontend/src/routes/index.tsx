import { createFileRoute } from '@tanstack/react-router';

import { handleOnboardingRedirection } from '$helpers/onboarding';
import Dashboard from '$pages/Dashboard';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(context, location);
  },
  component: Dashboard,
});
