import { PropsWithChildren } from 'react';
import AppLogo from '../AppLogo';

type Props = PropsWithChildren;

function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-row bg-gradient-to-t from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700">
      <div className="hidden w-full p-5 text-white lg:block">
        <AppLogo withText />
      </div>
      <div className="flex w-full flex-col items-center bg-white p-5 text-center dark:bg-slate-900 lg:justify-center lg:rounded-l-xl">
        <AppLogo className="mb-6" withText />
        <div className="flex w-full flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
