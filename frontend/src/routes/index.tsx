import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import AppContext from '../context';
import { useMutation } from '@tanstack/react-query';
import { signOut } from '../api/account';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({ to: '/sign-in' });
    }

    if (!context.user.username) {
      throw redirect({ to: '/set-username' });
    }
  },
  component: HomeComponent,
});

function HomeComponent() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const signOutMutation = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
  });

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>
        <button onClick={() => signOutMutation.mutate()}>Sign out</button>
      </p>
    </div>
  );
}

