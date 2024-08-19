import { Dialog, DialogContent } from '$ui/dialog';

export type Props = {
  open: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmationDialog({ onConfirm, onCancel, ...dialogProps }: Props) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent asChild>
        <div>
          <p>Are you sure you want to delete this item?</p>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
