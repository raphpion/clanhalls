import { Fragment, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { flushSync } from 'react-dom';

import {
  acceptInvitation,
  verifyInvitation,
  type VerifyClanInvitationData,
} from '$api/account';
import { usePageTitle } from '$hooks';
import { useToast } from '$ui/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '$ui/input-otp';

import BackButton from './BackButton';
import { type ViewProps } from './CreateOrJoinClan';
import Loading from '../../../common/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';

function Join({ setView }: ViewProps) {
  usePageTitle('Join a clan');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [, setCode] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<
    VerifyClanInvitationData | null | undefined
  >();

  const verifyInvitationQuery = useQuery({
    queryKey: ['clan-invitation'],
    queryFn: async () => {
      if (!submittedCode) setVerificationData(undefined);

      try {
        const invitation = await verifyInvitation(submittedCode!);
        setVerificationData(invitation);
      } catch (error) {
        flushSync(() => {
          setVerificationData(undefined);
          setSubmittedCode(null);
        });

        toast({
          title:
            'An error occurred while fetching the invitation. Please try again later or with a different code.',
          variant: 'destructive',
        });
      }

      return null;
    },
    enabled: submittedCode !== null,
    retry: false,
  });

  const acceptInvitationMutation = useMutation({
    mutationKey: ['accept-invitation', submittedCode],
    mutationFn: acceptInvitation,
    onMutate: () => {
      toast({
        title: 'Accepting invitation...',
        variant: 'loading',
      });
    },
    onError: () => {
      toast({
        title: 'An error occurred while accepting the invitation.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Invitation accepted successfully!',
        variant: 'success',
      });
      navigate({ to: '/' });
    },
  });

  if (!verificationData || !verificationData.valid) {
    const handleCodeChange = (value: string) => {
      setCode(value);
      setSubmittedCode(value?.length === 6 ? value : null);
    };

    return (
      <Fragment>
        <BackButton onClick={() => setView('intro')} />
        <p className="mb-8 text-justify">
          If you have received an invitation code, please enter it in the field
          below. Don't worry, you'll be able to validate the details before
          joining.
        </p>
        <InputOTP
          autoFocus
          containerClassName="w-fit mx-auto mb-4"
          maxLength={6}
          onChange={handleCodeChange}
          disabled={verifyInvitationQuery.isFetching}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {verifyInvitationQuery.isFetching && <Loading className="mx-auto" />}
        {!verifyInvitationQuery.isFetching &&
          verificationData?.valid === false && (
            <p className="text-center text-red-500">
              We're sorry but that invitation code is not valid.{' '}
            </p>
          )}
      </Fragment>
    );
  }

  const handleClickAccept = () =>
    acceptInvitationMutation.mutate(submittedCode!);
  const handleClickDecline = () => setView('intro');

  if (!verificationData.clan || !verificationData.sender) {
    toast({
      title: 'An error occurred while fetching the invitation details.',
      variant: 'destructive',
    });

    setSubmittedCode(null);
    setVerificationData(undefined);
    return null;
  }

  const { sender, clan } = verificationData;
  const differentName =
    clan.nameInGame !== null && clan.name !== clan.nameInGame;

  const buttonsDisabled = acceptInvitationMutation.isPending;

  return (
    <Fragment>
      <Avatar className="mx-auto mb-4">
        <AvatarImage src={sender.pictureUrl || ''} alt={sender.username} />
        <AvatarFallback>{sender.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <p className="mb-8 text-center">
        <span className="font-semibold">{sender.username}</span> has invited you
        to join{' '}
        <span className="font-semibold">{verificationData.clan.name}</span>!
        {differentName && (
          <Fragment>
            <br />({clan.nameInGame})
          </Fragment>
        )}
      </p>
      <p className="mb-4 text-justify">
        Do you want to accept their invitation? You can always leave the clan
        later.
      </p>
      <div className="flex w-full items-center justify-end gap-4">
        <Button
          variant="default"
          onClick={handleClickAccept}
          disabled={buttonsDisabled}
        >
          Join {clan.name}
        </Button>
        <Button
          variant="outline"
          onClick={handleClickDecline}
          disabled={buttonsDisabled}
        >
          Decline
        </Button>
      </div>
    </Fragment>
  );
}

export default Join;
