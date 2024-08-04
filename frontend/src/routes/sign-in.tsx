import { createFileRoute, redirect } from '@tanstack/react-router';
import SignIn from '$pages/SignIn';

export const Route = createFileRoute('/sign-in')({
  beforeLoad: ({ context, location }) => {
    if (context.user === null) {
      return;
    }

    if (!context.user.username) {
      throw redirect({
        to: '/onboarding/set-username',
        search: { next: location.pathname },
      });
    }

    throw redirect({ to: '/' });
  },
  component: SignIn,
});
