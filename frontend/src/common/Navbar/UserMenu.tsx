import { Fragment, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CrownIcon, LogOutIcon, SettingsIcon } from 'lucide-react';

import { signOut } from '$api/account';
import useAppContext from '$common/AppContext';
import Settings from '$common/Settings';
import { Avatar, AvatarImage, AvatarFallback } from '$ui/avatar';
import { Button } from '$ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '$ui/dropdown-menu';

function UserMenu() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const signOutMutation = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
  });

  const handleClickSignOut = () => signOutMutation.mutate();

  if (!user || !user.username) {
    return null;
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.pictureUrl || ''} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {user.isSuperAdmin && (
              <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                <CrownIcon size={16} className="mr-2" />
                Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              <SettingsIcon size={16} className="mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClickSignOut}>
            <LogOutIcon size={16} className="mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Fragment>
  );
}

export default UserMenu;
