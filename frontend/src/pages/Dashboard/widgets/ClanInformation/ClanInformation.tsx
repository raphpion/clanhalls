import { useMutation } from '@tanstack/react-query';

import { deleteMyClan } from '$api/account';
import useAppContext from '$common/AppContext';
import useConfirmationDialog from '$common/ConfirmationDialog/ConfirmationDialogContext';
import { Button } from '$ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '$ui/card';
import { toast } from '$ui/hooks/use-toast';

function ClanInformation() {
  const { clan } = useAppContext();
  const { askConfirmation } = useConfirmationDialog();

  const deleteClanMutation = useMutation({
    mutationKey: ['deleteClan'],
    mutationFn: deleteMyClan,
    onMutate: () => {
      toast({
        title: 'Deleting clan...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Clan deleted successfully!',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to delete clan.',
        variant: 'destructive',
      });
    },
  });

  if (!clan) return null;

  const handleClickDeleteClan = async () => {
    const confirmed = await askConfirmation({
      title: 'Delete clan?',
      description:
        'Are you sure you want to delete your clan? You will lose all data associated with it and will need to create a new one to use the app.',
      confirmLabel: 'Yes, delete my clan',
      confirmVariant: 'destructive',
    });

    if (!confirmed) return;

    await deleteClanMutation.mutateAsync();
    window.location.reload();
  };

  return (
    <Card className="mb-8 w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{clan.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clan.lastSyncedAt && (
          <p>Last synced at {new Date(clan.lastSyncedAt).toLocaleString()}.</p>
        )}
        <Button variant="destructive" onClick={handleClickDeleteClan}>
          Delete clan
        </Button>
      </CardContent>
    </Card>
  );
}

export default ClanInformation;
