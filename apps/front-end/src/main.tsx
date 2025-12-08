import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { AppProvider } from './app/provider';

async function enableMocking(): Promise<void> {
  if (import.meta.env.VITE_API_MOCKING === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

async function bootstrap(): Promise<void> {
  await enableMocking();

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <React.StrictMode>
      <AppProvider />
    </React.StrictMode>,
  );
}

bootstrap();
