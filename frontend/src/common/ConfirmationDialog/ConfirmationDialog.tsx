import { Button, type ButtonProps } from '$ui/button';
import { Dialog, DialogContent } from '$ui/dialog';

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
        <div>
          <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
          <p className="mb-6">{description}</p>
          <div className="flex space-x-4">
            <Button variant={confirmVariant || 'default'} onClick={onConfirm}>
              {confirmLabel || 'Confirm'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel || 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
