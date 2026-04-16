import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'stream-schema - Live structured AI output for React',
  description:
    'Bind structured AI JSON to your React UI as it streams. Watch your interface paint itself in real time.',
  openGraph: {
    title: 'stream-schema',
    description: 'Watch your React UI paint itself from streaming AI output.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
