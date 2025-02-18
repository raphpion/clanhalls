import { createFileRoute, redirect } from '@tanstack/react-router';

import Invitations from '$pages/Invitations';

import { handleOnboardingRedirection } from '../../helpers/onboarding';

export const Route = createFileRoute('/invitations/')({
  component: Invitations,
  beforeLoad: ({ context, location }) => {
    handleOnboardingRedirection(context, location);
    if (!context.user?.isClanAdmin) {
      throw redirect({ to: '/' });
    }
  },
});

