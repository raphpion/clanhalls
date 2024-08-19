import { createContext } from 'react';

type ConfirmationDialogContextType = {};

const ConfirmationDialogContext = createContext<
  ConfirmationDialogContextType | undefined
>(undefined);

export default ConfirmationDialogContext;
