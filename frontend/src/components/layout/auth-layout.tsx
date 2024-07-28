import { PropsWithChildren } from 'react';
import Logo from '../logo';

type Props = PropsWithChildren;

function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-row bg-gradient-to-t from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700">
      <div className="hidden w-full p-5 text-white lg:block">
        <div className="flex flex-row items-center space-x-2">
          <Logo />
          <span className="text-xl font-semibold">Clan Halls</span>
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-white p-5 text-center dark:bg-slate-900 lg:justify-center lg:rounded-l-xl">
        <div className="mb-6 flex w-full items-center justify-start space-x-2 lg:hidden">
          <Logo />
          <span className="font-semibold">Clan Halls</span>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
