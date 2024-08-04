import { createFileRoute } from '@tanstack/react-router';

import { OnboardingLayout } from '$common';

export const Route = createFileRoute('/mock')({
  component: () => <OnboardingLayout title="Set Username" />,
});

