import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import Create from './Create';
import Intro from './Intro';
import Join from './Join';
import OnboardingLayout from '../../../common/OnboardingLayout';

const VIEWS = [
  {
    key: 'intro',
    title: 'Create or join a clan',
    component: Intro,
  },
  {
    key: 'create',
    title: 'Create a clan',
    component: Create,
  },
  {
    key: 'join',
    title: 'Join a clan',
    component: Join,
  },
] as const;

export type View = (typeof VIEWS)[number]['key'];

export type ViewProps = {
  setView: (view: View) => void;
};

function CreateOrJoinClan() {
  const [view, setView] = useState<View>('intro');

  const {
    key,
    title,
    component: Component,
  } = VIEWS.find((v) => v.key === view)!;

  return (
    <OnboardingLayout title={title}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Component key={key} setView={setView} />
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  );
}

export default CreateOrJoinClan;
