import { Fragment } from 'react';

import { EditIcon, EllipsisIcon, KeyRoundIcon, Trash2Icon } from 'lucide-react';

import { type CredentialsData } from '$api/account';
import { Button } from '$ui/button';
import { Card } from '$ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '$ui/dropdown-menu';
import { cn } from '$ui/utils';

import useCredentialsContext from './context';
import { formatDateToLocal } from '../../../helpers/dates';
import useConfirmationDialog from '../../ConfirmationDialog/context';

type Props = {
  credential: CredentialsData;
  isFirst?: boolean;
  isLast?: boolean;
};

function Credential({ credential, isFirst, isLast }: Props) {
  const { askConfirmation } = useConfirmationDialog();
  const { deleteCredentials, openEditSlideOut, refetch } =
    useCredentialsContext();

  const handleClickDelete = async () => {
    const confirmed = await askConfirmation({
      title: `Delete credential '${credential.name}'?`,
      description:
        'Are you sure you want to delete this credential? This action cannot be undone.',
      confirmLabel: 'Yes, delete credential',
      confirmVariant: 'destructive',
    });

    if (!confirmed) return;

    await deleteCredentials(credential.clientId);
    refetch();
  };

  const handleClickEdit = () => openEditSlideOut(credential);

  return (
    <Fragment>
      <Card
        key={credential.clientId}
        className={cn('rounded-none p-4', {
          'rounded-t-lg': isFirst,
          'rounded-b-lg': isLast,
          'border-t-0': !isFirst,
        })}
      >
        <div className="flex flex-row items-center space-x-4">
          <KeyRoundIcon size={32} absoluteStrokeWidth />
          <div className="flex-1">
            <p className="text-lg font-semibold">{credential.name}</p>
            <p>{credential.clientId}</p>
            <p className="text-slate-500">
              Created on {formatDateToLocal(credential.createdAt, true)}
            </p>
            <p className="text-slate-500">
              {credential.lastUsedAt
                ? `Last used on ${formatDateToLocal(credential.lastUsedAt, true)}`
                : 'Never used'}
            </p>
            {credential.scope && (
              <p className="text-sm text-slate-500">
                — {credential.scope.replace(/,/g, ', ')}
              </p>
            )}
          </div>
          <div className="self-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  <EllipsisIcon size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleClickEdit}>
                  <EditIcon size={16} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="!text-red-500"
                  onClick={handleClickDelete}
                >
                  <Trash2Icon size={16} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </Fragment>
  );
}

export default Credential;
