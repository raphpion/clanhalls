import { type PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  type CreateCredentialsData,
  getCredentials,
  type CredentialsData,
  createCredentials,
  updateCredentials,
  deleteCredentials,
} from '$api/account';
import { useToast } from '$ui/hooks/use-toast';

import { CredentialsContext } from './context';
import CreateOrEditCredential from './CreateOrEditCredential';

function Provider({ children }: PropsWithChildren) {
  const { toast, genericErrorToast } = useToast();

  const [createOrEditSlideOutOpen, setCreateOrEditSlideOutOpen] =
    useState(false);
  const [editingCredential, setEditingCredential] = useState<
    CredentialsData | undefined
  >(undefined);
  const [createdCredential, setCreatedCredential] =
    useState<CreateCredentialsData>();

  const credentialsQuery = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials,
  });

  const createCredentialsMutation = useMutation({
    mutationKey: ['create-credentials'],
    mutationFn: createCredentials,
    onMutate: () => {
      toast({
        title: 'Creating credential...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Credential created successfully!',
        variant: 'success',
      });
    },
    onError: genericErrorToast,
  });

  const updateCredentialsMutation = useMutation({
    mutationKey: ['update-credentials'],
    mutationFn: updateCredentials,
    onMutate: () => {
      toast({
        title: 'Updating credential...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Credential updated successfully!',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'An unexpected error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const deleteCredentialMutation = useMutation({
    mutationKey: ['delete-credential'],
    mutationFn: deleteCredentials,
    onMutate: () => {
      toast({
        title: 'Deleting credential...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Credential deleted successfully!',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'An unexpected error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const handleCloseCreateOrEditSlideOut = useCallback((_: boolean) => {
    setCreateOrEditSlideOutOpen(false);
    setTimeout(() => setEditingCredential(undefined), 300);
  }, []);

  const handleOpenCreateSlideOut = useCallback(() => {
    setEditingCredential(undefined);
    setCreateOrEditSlideOutOpen(true);
  }, []);

  const handleOpenEditSlideOut = useCallback((credential: CredentialsData) => {
    setEditingCredential(credential);
    setCreateOrEditSlideOutOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(
    (createdCredential: CreateCredentialsData) => {
      credentialsQuery.data?.push({
        name: createdCredential.name,
        scope: createdCredential.scope,
        clientId: createdCredential.clientId,
        createdAt: createdCredential.createdAt,
        lastUsedAt: null,
      });

      setCreatedCredential(createdCredential);
      setCreateOrEditSlideOutOpen(false);
      setTimeout(() => setEditingCredential(undefined), 300);
      credentialsQuery.refetch();
    },
    [credentialsQuery],
  );

  const handleEditSuccess = useCallback(
    (name: string, scope: string) => {
      const updatedCredential = credentialsQuery.data?.find(
        (c) => c.clientId === editingCredential?.clientId,
      );

      if (updatedCredential) {
        updatedCredential.name = name;
        updatedCredential.scope = scope;
      }

      setCreateOrEditSlideOutOpen(false);
      setTimeout(() => setEditingCredential(undefined), 300);
      credentialsQuery.refetch();
    },
    [credentialsQuery, editingCredential?.clientId],
  );

  const value = useMemo(
    () => ({
      loading: credentialsQuery.isLoading,
      editPending: updateCredentialsMutation.isPending,
      createPending: createCredentialsMutation.isPending,
      deletePending: deleteCredentialMutation.isPending,
      credentials: credentialsQuery.data,
      createdCredential,
      createOrEditSlideOutProps: {
        open: createOrEditSlideOutOpen,
        editingCredential,
        onOpenChange: handleCloseCreateOrEditSlideOut,
        onCreateSuccess: handleCreateSuccess,
        onEditSuccess: handleEditSuccess,
      },
      dismissCreatedCredential: () => setCreatedCredential(undefined),
      openCreateSlideOut: handleOpenCreateSlideOut,
      openEditSlideOut: handleOpenEditSlideOut,
      createCredentials: createCredentialsMutation.mutateAsync,
      deleteCredentials: deleteCredentialMutation.mutateAsync,
      editCredentials: updateCredentialsMutation.mutateAsync,
      refetch: credentialsQuery.refetch,
    }),
    [
      createCredentialsMutation.isPending,
      createCredentialsMutation.mutateAsync,
      createOrEditSlideOutOpen,
      createdCredential,
      credentialsQuery.data,
      credentialsQuery.isLoading,
      credentialsQuery.refetch,
      deleteCredentialMutation.isPending,
      deleteCredentialMutation.mutateAsync,
      editingCredential,
      handleCloseCreateOrEditSlideOut,
      handleCreateSuccess,
      handleEditSuccess,
      handleOpenCreateSlideOut,
      handleOpenEditSlideOut,
      updateCredentialsMutation.isPending,
      updateCredentialsMutation.mutateAsync,
    ],
  );

  return (
    <CredentialsContext.Provider value={value}>
      {children}
      <CreateOrEditCredential {...value.createOrEditSlideOutProps} />
    </CredentialsContext.Provider>
  );
}

export default Provider;
