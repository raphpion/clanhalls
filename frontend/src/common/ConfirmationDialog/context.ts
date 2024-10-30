import { createContext, useContext } from 'react';

import { type Props } from './ConfirmationDialog';

export type PropsState = Omit<Props, 'onConfirm' | 'onCancel'>;

export type AskConfirmationArgs = Omit<PropsState, 'open'>;

export type ConfirmationDialogContextType = {
  askConfirmation(args: AskConfirmationArgs): Promise<boolean>;
};

export const ConfirmationDialogContext = createContext<
  ConfirmationDialogContextType | undefined
>(undefined);

function useConfirmationDialog() {
  const context = useContext(ConfirmationDialogContext);
  if (context === undefined) {
    throw new Error(
      'useConfirmationDialog must be used within a ConfirmationDialogProvider',
    );
  }

  return context;
}

export default useConfirmationDialog;
