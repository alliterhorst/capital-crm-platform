import { JSX } from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout(): JSX.Element {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
      <div className="w-full max-w-md px-4">
        <Outlet />
      </div>
    </div>
  );
}
