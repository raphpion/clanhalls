import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import ConfirmationDialog, { Props } from './ConfirmationDialog';

type AskConfirmationArgs = Pick<Props, 'title' | 'description'>;

type PropsState = Pick<
  Props,
  'open' | 'title' | 'description' | 'onOpenChange'
>;

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
    onOpenChange: () => {},
  });

  const [resolve, setResolve] = useState<(value: boolean) => void>(() => {});

  const askConfirmation = useCallback(
    ({ title, description }: AskConfirmationArgs) => {
      setProps((prev) => ({
        ...prev,
        open: true,
        title,
        description,
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
