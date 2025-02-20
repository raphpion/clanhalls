import { Fragment } from 'react';

import { LogInIcon, PlusCircleIcon } from 'lucide-react';

import { usePageTitle } from '$hooks';
import { Card, CardContent, CardHeader, CardTitle } from '$ui/card';
import { cn } from '$ui/utils';

import { type ViewProps } from './CreateOrJoinClan';

function Intro({ setView }: ViewProps) {
  usePageTitle('Create or join a clan');

  return (
    <Fragment>
      <p className="mb-8">
        You need to create or join a clan to be able to use the application.
      </p>
      <Card className={styles.card} onClick={() => setView('create')}>
        <CardHeader className={styles.cardHeader}>
          <PlusCircleIcon size={32} className="mr-2 block" />
          <CardTitle className="!mt-0">Create a clan</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          Create your own clan, then invite your friends.
        </CardContent>
      </Card>
      <Card className={styles.card} onClick={() => setView('join')}>
        <CardHeader className={styles.cardHeader}>
          <LogInIcon size={32} className="mr-2 block" />
          <CardTitle className="!mt-0">Join a clan</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          Enter an invitation code to join your friends.
        </CardContent>
      </Card>
    </Fragment>
  );
}

const styles = {
  card: cn(
    'cursor-pointer dark:text-white transition-all mb-4 bg-slate-100 dark:bg-slate-900 duration-300 relative overflow-hidden',
    'before:absolute before:z-0 before:inset-0 before:bg-gradient-to-tr before:from-purple-400 before:to-blue-400',
    'before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 hover:translate-x-1',
  ),
  cardHeader: 'relative flex flex-row items-center',
  cardContent: 'relative',
};

export default Intro;
