import { useCallback, useState, type PropsWithChildren } from 'react';

import ConfirmationDialog from './ConfirmationDialog';
import {
  type AskConfirmationArgs,
  ConfirmationDialogContext,
  type PropsState,
} from './context';

export function ConfirmationDialogProvider({ children }: PropsWithChildren) {
  const [props, setProps] = useState<PropsState>({
    open: false,
    title: '',
    description: '',
    confirmLabel: undefined,
    cancelLabel: undefined,
    confirmVariant: undefined,
  });

  const [resolve, setResolve] = useState<(value: boolean) => void>(() => {});

  const askConfirmation = useCallback(
    ({
      title,
      description,
      confirmLabel,
      confirmVariant,
      cancelLabel,
    }: AskConfirmationArgs) => {
      setProps((prev) => ({
        ...prev,
        open: true,
        title,
        description,
        confirmLabel,
        cancelLabel,
        confirmVariant,
      }));

      return new Promise<boolean>((resolve) => {
        setResolve(() => resolve);
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    setProps((prev) => ({ ...prev, open: false }));
    resolve(true);
  }, [resolve]);

  const handleCancel = useCallback(() => {
    setProps((prev) => ({ ...prev, open: false }));
    resolve(false);
  }, [resolve]);

  return (
    <ConfirmationDialogContext.Provider value={{ askConfirmation }}>
      {children}
      <ConfirmationDialog
        {...props}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationDialogContext.Provider>
  );
}

export default ConfirmationDialogProvider;
