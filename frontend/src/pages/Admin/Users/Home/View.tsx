import { Fragment } from 'react';

import { useMutation } from '@tanstack/react-query';
import {
  Check,
  EllipsisIcon,
  LogOutIcon,
  ShieldBanIcon,
  ShieldPlusIcon,
} from 'lucide-react';

import {
  disableUser,
  enableUser,
  signOutAllUserSessions,
  type AdminListUsersData,
} from '$api/admin';
import useAppContext from '$common/AppContext';
import { useConfirmationDialog } from '$common/ConfirmationDialog';
import { Avatar, AvatarImage } from '$ui/avatar';
import { Button } from '$ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '$ui/dropdown-menu';
import { toast } from '$ui/hooks/use-toast';
import { TableCell, TableRow } from '$ui/table';

import Loading from './Loading';
import NoContent from './NoContent';

type Props = {
  data: AdminListUsersData[] | undefined;
  loading: boolean;
  refetch: () => void;
};

function View({ data, loading, refetch }: Props) {
  const { user: currentUser } = useAppContext();
  const { askConfirmation } = useConfirmationDialog();

  const handleDisable = async (googleId: string) => {
    const confirmed = await askConfirmation({
      title: 'Disable user?',
      description:
        'Are you sure you want to disable this user? This user will no longer be able to sign in until re-enabled.',
      confirmLabel: 'Yes, disable user',
      confirmVariant: 'destructive',
    });

    if (!confirmed) return;

    await disableUserMutation.mutateAsync(googleId);
  };

  const handleEnable = async (googleId: string) => {
    const confirmed = await askConfirmation({
      title: 'Enable user?',
      description:
        'Are you sure you want to enable this user? This user will be able to sign in again.',
      confirmLabel: 'Yes, enable user',
      confirmVariant: 'default',
    });

    if (!confirmed) return;

    await enableUserMutation.mutateAsync(googleId);
  };

  const handleSignOutAll = async (googleId: string) => {
    const confirmed = await askConfirmation({
      title: 'Sign out all user sessions?',
      description:
        'Are you sure you want to sign out all sessions for this user?',
      confirmLabel: 'Yes, sign out all sessions',
      confirmVariant: 'destructive',
    });

    if (!confirmed) return;

    await signOutAllUserSessionsMutation.mutateAsync(googleId);
  };

  const disableUserMutation = useMutation({
    mutationKey: ['disable-user'],
    mutationFn: disableUser,
    onMutate: () => {
      toast({
        title: 'Disabling user...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'User disabled successfully.',
        variant: 'success',
      });
    },
  });

  const enableUserMutation = useMutation({
    mutationKey: ['enable-user'],
    mutationFn: enableUser,
    onMutate: () => {
      toast({
        title: 'Enabling user...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'User enabled successfully.',
        variant: 'success',
      });
    },
  });

  const signOutAllUserSessionsMutation = useMutation({
    mutationKey: ['sign-out-all-user-sessions'],
    mutationFn: signOutAllUserSessions,
    onMutate: () => {
      toast({
        title: 'Signing out all user sessions...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'User signed out successfully.',
        variant: 'success',
      });
    },
  });

  if (!currentUser) return null;

  if (loading) return <Loading columns={4} rows={10} />;

  if (!data || data.length === 0) {
    return (
      <NoContent text="No users found for the current filters." columns={4} />
    );
  }

  return data.map((user) => (
    <TableRow key={user.username}>
      <TableCell className="flex items-center gap-4 font-semibold">
        <Avatar>
          <AvatarImage
            src={user.pictureUrl || ''}
            alt={user.username || user.email}
          />
        </Avatar>
        {user.username || '—'}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.enabled && <Check size={16} />}</TableCell>
      <TableCell>{user.isSuperAdmin && <Check size={16} />}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-2">
              <EllipsisIcon size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user.googleId !== currentUser.googleId && (
              <Fragment>
                {user.enabled ? (
                  <Fragment>
                    <DropdownMenuItem
                      onClick={() => handleDisable(user.googleId)}
                    >
                      <ShieldBanIcon size={16} className="mr-2" />
                      Disable
                    </DropdownMenuItem>
                  </Fragment>
                ) : (
                  <DropdownMenuItem onClick={() => handleEnable(user.googleId)}>
                    <ShieldPlusIcon size={16} className="mr-2" />
                    Enable
                  </DropdownMenuItem>
                )}
              </Fragment>
            )}
            <DropdownMenuItem onClick={() => handleSignOutAll(user.googleId)}>
              <LogOutIcon size={16} className="mr-2" />
              Sign out all
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));
}

export default View;
