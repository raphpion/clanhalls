import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

import type { Props } from './ConfirmationDialog';
import ConfirmationDialog from './ConfirmationDialog';

type AskConfirmationArgs = Omit<PropsState, 'open'>;

type PropsState = Omit<Props, 'onConfirm' | 'onCancel'>;

type ConfirmationDialogContextType = {
  askConfirmation(args: AskConfirmationArgs): Promise<boolean>;
};

export const ConfirmationDialogContext = createContext<
  ConfirmationDialogContextType | undefined
>(undefined);

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
