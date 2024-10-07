import { useMemo, type PropsWithChildren } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getActiveSessions,
  revokeAllSessions,
  revokeSession,
} from '$api/account';
import { useToast } from '$ui/hooks/use-toast';

import { SessionsContext } from './context';

function Provider({ children }: PropsWithChildren) {
  const { toast, genericErrorToast } = useToast();

  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: getActiveSessions,
  });

  const revokeSessionMutation = useMutation({
    mutationKey: ['revokeSession'],
    mutationFn: revokeSession,
    onMutate: () => {
      toast({
        title: 'Revoking session...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Session revoked successfully!',
        variant: 'success',
      });
    },
    onError: genericErrorToast,
  });

  const revokeAllSessionsMutation = useMutation({
    mutationKey: ['revokeAllSessions'],
    mutationFn: revokeAllSessions,
    onMutate: () => {
      toast({
        title: 'Revoking all sessions...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'All sessions revoked successfully!',
        variant: 'success',
      });

      window.location.reload();
    },
    onError: genericErrorToast,
  });

  const value = useMemo(
    () => ({
      loading: sessionsQuery.isLoading,
      sessions: sessionsQuery.data,
      revokeAllSessions: revokeAllSessionsMutation.mutateAsync,
      revokeSession: revokeSessionMutation.mutateAsync,
      refetch: sessionsQuery.refetch,
    }),
    [
      sessionsQuery.isLoading,
      sessionsQuery.data,
      sessionsQuery.refetch,
      revokeAllSessionsMutation.mutateAsync,
      revokeSessionMutation.mutateAsync,
    ],
  );

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}

export default Provider;
