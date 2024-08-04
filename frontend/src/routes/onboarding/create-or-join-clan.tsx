import { createFileRoute, redirect } from '@tanstack/react-router';
import CreateOrJoinClan from '$pages/Onboarding/CreateOrJoinClan';

export const Route = createFileRoute('/onboarding/create-or-join-clan')({
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({ to: '/sign-in' });
    }

    if (!context.user.username) {
      throw redirect({ to: '/' });
    }
  },
  component: CreateOrJoinClan,
});

