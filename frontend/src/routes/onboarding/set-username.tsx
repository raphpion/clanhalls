import { createFileRoute, redirect } from '@tanstack/react-router';
import SetUsername from '$pages/Onboarding/SetUsername';

export const Route = createFileRoute('/onboarding/set-username')({
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({ to: '/sign-in' });
    }

    if (!context.user.username) {
      return;
    }

    if (!context.clan) {
      throw redirect({ to: '/onboarding/create-or-join-clan' });
    }

    throw redirect({ to: '/' });
  },
  component: SetUsername,
});
