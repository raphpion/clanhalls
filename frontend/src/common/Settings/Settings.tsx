import { useState } from 'react';

import { KeyRoundIcon, RouterIcon } from 'lucide-react';

import { Button } from '$ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '$ui/sheet';
import { cn } from '$ui/utils';

import Credentials from './Credentials';
import CredentialsProvider from './Credentials/Provider';
import Sessions from './Sessions';
import SessionsProvider from './Sessions/Provider';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TABS = [
  {
    key: 'credentials',
    label: 'Credentials',
    icon: KeyRoundIcon,
    component: Credentials,
    provider: CredentialsProvider,
  },
  {
    key: 'sessions',
    label: 'Sessions',
    icon: RouterIcon,
    component: Sessions,
    provider: SessionsProvider,
  },
] as const;

type Tab = (typeof TABS)[number];

function Settings({ ...props }: Props) {
  const [tab, setTab] = useState<Tab['key']>(TABS[0].key);

  const currentTab = TABS.find((t) => t.key === tab) || TABS[0];

  return (
    <Sheet {...props}>
      <SheetContent className="w-full sm:max-w-full xl:max-w-screen-xl">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold md:text-4xl">
            Settings
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-8 md:flex-row md:space-x-16 md:space-y-0">
          <div className="w-full max-w-xs">
            {TABS.map((tab) => (
              <Button
                key={tab.key}
                className={cn(
                  'flex w-full justify-start rounded-lg transition-all hover:bg-slate-300 dark:hover:bg-slate-800',
                  {
                    'bg-slate-200 dark:bg-slate-900':
                      tab.key === currentTab.key,
                  },
                )}
                onClick={() => setTab(tab.key)}
                variant="link"
              >
                <tab.icon size={20} className="mr-2" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
          <div className="max-w-screen-md flex-1">
            {currentTab.provider ? (
              <currentTab.provider>
                <currentTab.component />
              </currentTab.provider>
            ) : (
              <currentTab.component />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Settings;
