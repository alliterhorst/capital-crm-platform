import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/api-client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes';
import { JSX } from 'react';
import { Toaster } from '@/shared/ui/sonner';

export function AppProvider(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" expand richColors closeButton />
    </QueryClientProvider>
  );
}
