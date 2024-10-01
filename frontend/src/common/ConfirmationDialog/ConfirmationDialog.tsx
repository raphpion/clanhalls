import { Button, type ButtonProps } from '$ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '$ui/dialog';

export type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonProps['variant'];
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmationDialog({
  confirmLabel,
  cancelLabel,
  confirmVariant,
  onConfirm,
  onCancel,
  ...dialogProps
}: Props) {
  const { title, description } = dialogProps;

  const handleOpenChange = (_: boolean) => {
    onCancel();
  };

  return (
    <Dialog {...dialogProps} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button variant={confirmVariant || 'default'} onClick={onConfirm}>
            {confirmLabel || 'Confirm'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel || 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
