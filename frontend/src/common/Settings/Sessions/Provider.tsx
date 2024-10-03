import { useMemo, type PropsWithChildren } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';

import { getActiveSessions, revokeSession } from '$api/account';
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

  const value = useMemo(
    () => ({
      loading: sessionsQuery.isLoading,
      sessions: sessionsQuery.data,
      revokeSession: revokeSessionMutation.mutateAsync,
      refetch: sessionsQuery.refetch,
    }),
    [
      sessionsQuery.isLoading,
      sessionsQuery.data,
      sessionsQuery.refetch,
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
