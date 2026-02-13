import React from 'react';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header } from './_components/Header';
import './_css/app.scss';
import { AuthProvider } from './_providers/Auth';
export const metadata = {
  description: 'An example of how to authenticate with Payload from a Next.js app.',
  title: 'Payload Auth + Next.js App Router Example',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SpeedInsights />
        <AuthProvider api="rest">
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
