import { createContext, useContext } from 'react';

import {
  type CreateCredentialsData,
  type CredentialsData,
  type CreateCredentialsPayload,
  type UpdateCredentialsPayload,
} from '$api/account';

import { type Props as CreateOrEditCrendentialProps } from './CreateOrEditCredential';

export type CredentialsContextType = {
  loading: boolean;
  editPending: boolean;
  deletePending: boolean;
  createPending: boolean;
  credentials: CredentialsData[] | undefined;
  createdCredential: CreateCredentialsData | undefined;
  createOrEditSlideOutProps: CreateOrEditCrendentialProps;
  dismissCreatedCredential: () => void;
  openCreateSlideOut: () => void;
  openEditSlideOut: (credential: CredentialsData) => void;
  createCredentials: (
    payload: CreateCredentialsPayload,
  ) => Promise<CreateCredentialsData>;
  deleteCredentials: (clientId: string) => Promise<void>;
  editCredentials: (
    payload: UpdateCredentialsPayload & { clientId: string },
  ) => Promise<void>;
  refetch: () => Promise<unknown>;
};

export const CredentialsContext = createContext<CredentialsContextType>({
  loading: false,
  editPending: false,
  createPending: false,
  deletePending: false,
  credentials: undefined,
  createdCredential: undefined,
  createOrEditSlideOutProps: {
    open: false,
    editingCredential: undefined,
    onOpenChange: () => {},
    onCreateSuccess: async () => {},
    onEditSuccess: async () => {},
  },
  dismissCreatedCredential: () => {},
  openCreateSlideOut: () => {},
  createCredentials: async () => ({
    name: '',
    scope: '',
    clientId: '',
    clientSecret: '',
    createdAt: '',
    lastUsedAt: null,
  }),
  deleteCredentials: async () => {},
  editCredentials: async () => {},
  openEditSlideOut: () => {},
  refetch: async () => {},
});

function useCredentialsContext() {
  const context = useContext(CredentialsContext);

  if (context === undefined) {
    throw new Error(
      'useCredentials must be used within a CredentialsContextProvider',
    );
  }

  return context;
}

export default useCredentialsContext;
