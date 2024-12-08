import { createFileRoute, redirect } from '@tanstack/react-router';

import Admin from '$pages/Admin';

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.user?.isSuperAdmin) {
      throw redirect({ to: '/' });
    }
  },
  component: Admin,
});

