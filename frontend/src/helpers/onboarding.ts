import type { ParsedLocation } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';

import type { SessionData } from '../api/account';

export const ONBOARDING_STEPS = {
  SIGN_IN: '/sign-in',
  SET_USERNAME: '/onboarding/set-username',
  CREATE_CLAN: '/onboarding/create-clan',
  SYNC_CLAN: '/onboarding/sync-clan',
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

export function getCurrentOnboardingStep(
  context: SessionData,
): OnboardingStep | null {
  if (!context.user) {
    return ONBOARDING_STEPS.SIGN_IN;
  }

  if (!context.user.username) {
    return ONBOARDING_STEPS.SET_USERNAME;
  }

  if (!context.clan) {
    return ONBOARDING_STEPS.CREATE_CLAN;
  }

  if (!context.clan.lastSyncedAt) {
    return ONBOARDING_STEPS.SYNC_CLAN;
  }

  return null;
}

export function handleOnboardingRedirection(
  context: SessionData,
  location: ParsedLocation,
  step: OnboardingStep | null = null,
) {
  const currentStep = getCurrentOnboardingStep(context);

  if (currentStep === null) {
    if (step === null) {
      return;
    }

    throw redirect({ to: '/' });
  }

  if (location.pathname !== currentStep) {
    throw redirect({ to: currentStep });
  }
}
